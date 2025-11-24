// Advanced Voice Processing Service with WebRTC and AI Integration

class VoiceService {
    constructor() {
        this.mediaRecorder = null;
        this.audioContext = null;
        this.analyser = null;
        this.stream = null;
        this.audioChunks = [];
        this.isRecording = false;
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.websocket = null;
        this.vadProcessor = null;
        this.noiseSupression = true;
        this.echoCancellation = true;
        this.autoGainControl = true;
        
        // Default voice settings (will be overridden by database settings)
        this.voiceSettings = {
            quality: {
                high: { sampleRate: 48000, bitrate: 192 },
                medium: { sampleRate: 24000, bitrate: 128 },
                low: { sampleRate: 16000, bitrate: 64 }
            }
        };
    }

    // Initialize WebRTC with advanced audio processing
    async initializeAudio(qualitySettings = null) {
        try {
            // Use provided settings or defaults
            const sampleRate = qualitySettings?.sampleRate || this.voiceSettings.quality.high.sampleRate;
            
            // Advanced audio constraints for professional quality
            const constraints = {
                audio: {
                    echoCancellation: this.echoCancellation,
                    noiseSuppression: this.noiseSupression,
                    autoGainControl: this.autoGainControl,
                    sampleRate: sampleRate,
                    channelCount: 1,
                    latency: 0.02,
                    sampleSize: 16
                }
            };

            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            
            // Setup Web Audio API for real-time processing
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
                sampleRate: sampleRate
            });
            
            const source = this.audioContext.createMediaStreamSource(this.stream);
            
            // Create analyser for visualizations
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 2048;
            this.analyser.smoothingTimeConstant = 0.8;
            
            // Create noise gate
            const noiseGate = this.audioContext.createDynamicsCompressor();
            noiseGate.threshold.setValueAtTime(-50, this.audioContext.currentTime);
            noiseGate.knee.setValueAtTime(40, this.audioContext.currentTime);
            noiseGate.ratio.setValueAtTime(12, this.audioContext.currentTime);
            
            // Connect audio nodes
            source.connect(noiseGate);
            noiseGate.connect(this.analyser);
            
            // Initialize Voice Activity Detection
            this.initializeVAD();
            
            return true;
        } catch (error) {
            console.error('Error initializing audio:', error);
            throw new Error('Failed to access microphone. Please check permissions.');
        }
    }

    // Voice Activity Detection for intelligent recording
    initializeVAD() {
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        this.vadProcessor = setInterval(() => {
            if (this.isRecording) {
                this.analyser.getByteFrequencyData(dataArray);
                const average = dataArray.reduce((a, b) => a + b) / bufferLength;
                
                // Emit voice activity level for UI visualization
                if (this.onVoiceActivity) {
                    this.onVoiceActivity(average);
                }
                
                // Auto-pause recording during silence (optional)
                if (average < 10 && this.autoPause) {
                    this.pauseRecording();
                } else if (average > 10 && this.isPaused) {
                    this.resumeRecording();
                }
            }
        }, 100);
    }

    // Start recording with WebRTC
    async startRecording(format = 'webm') {
        if (!this.stream) {
            await this.initializeAudio();
        }

        this.audioChunks = [];
        
        const mimeType = `audio/${format};codecs=opus`;
        const options = {
            mimeType,
            audioBitsPerSecond: this.voiceSettings.quality.high.bitrate * 1000
        };

        this.mediaRecorder = new MediaRecorder(this.stream, options);
        
        this.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                this.audioChunks.push(event.data);
                
                // Stream to server for real-time processing
                if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
                    this.websocket.send(event.data);
                }
            }
        };

        this.mediaRecorder.onstop = () => {
            this.processRecording();
        };

        this.mediaRecorder.start(100); // Collect data every 100ms for streaming
        this.isRecording = true;
        
        // Start real-time transcription
        this.startRealtimeTranscription();
    }

    // Stop recording
    stopRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
            this.isRecording = false;
        }
        
        if (this.recognition) {
            this.recognition.stop();
        }
        
        return this.getAudioBlob();
    }

    // Process recorded audio
    async processRecording() {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        
        // Convert to WAV for better compatibility
        const wavBlob = await this.convertToWav(audioBlob);
        
        // Apply audio enhancements
        const enhancedBlob = await this.enhanceAudio(wavBlob);
        
        return enhancedBlob;
    }

    // Convert audio to WAV format
    async convertToWav(blob) {
        const arrayBuffer = await blob.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        
        // Convert to WAV
        const wavBuffer = this.audioBufferToWav(audioBuffer);
        return new Blob([wavBuffer], { type: 'audio/wav' });
    }

    // Audio buffer to WAV conversion
    audioBufferToWav(buffer) {
        const length = buffer.length * buffer.numberOfChannels * 2;
        const arrayBuffer = new ArrayBuffer(44 + length);
        const view = new DataView(arrayBuffer);
        
        // WAV header
        const writeString = (offset, string) => {
            for (let i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        };
        
        writeString(0, 'RIFF');
        view.setUint32(4, 36 + length, true);
        writeString(8, 'WAVE');
        writeString(12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, buffer.numberOfChannels, true);
        view.setUint32(24, buffer.sampleRate, true);
        view.setUint32(28, buffer.sampleRate * buffer.numberOfChannels * 2, true);
        view.setUint16(32, buffer.numberOfChannels * 2, true);
        view.setUint16(34, 16, true);
        writeString(36, 'data');
        view.setUint32(40, length, true);
        
        // Write audio data
        let offset = 44;
        for (let i = 0; i < buffer.length; i++) {
            for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
                const sample = buffer.getChannelData(channel)[i];
                const value = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
                view.setInt16(offset, value, true);
                offset += 2;
            }
        }
        
        return arrayBuffer;
    }

    // Enhance audio quality using Web Audio API
    async enhanceAudio(blob) {
        const arrayBuffer = await blob.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        
        const offlineContext = new OfflineAudioContext(
            audioBuffer.numberOfChannels,
            audioBuffer.length,
            audioBuffer.sampleRate
        );
        
        const source = offlineContext.createBufferSource();
        source.buffer = audioBuffer;
        
        // Apply compression
        const compressor = offlineContext.createDynamicsCompressor();
        compressor.threshold.value = -24;
        compressor.knee.value = 30;
        compressor.ratio.value = 12;
        compressor.attack.value = 0.003;
        compressor.release.value = 0.25;
        
        // Apply EQ
        const lowShelf = offlineContext.createBiquadFilter();
        lowShelf.type = 'lowshelf';
        lowShelf.frequency.value = 320;
        lowShelf.gain.value = -3;
        
        const highShelf = offlineContext.createBiquadFilter();
        highShelf.type = 'highshelf';
        highShelf.frequency.value = 3200;
        highShelf.gain.value = 3;
        
        // Connect nodes
        source.connect(lowShelf);
        lowShelf.connect(highShelf);
        highShelf.connect(compressor);
        compressor.connect(offlineContext.destination);
        
        source.start();
        const enhancedBuffer = await offlineContext.startRendering();
        
        const wavBuffer = this.audioBufferToWav(enhancedBuffer);
        return new Blob([wavBuffer], { type: 'audio/wav' });
    }

    // Real-time speech recognition
    startRealtimeTranscription() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.warn('Speech recognition not supported');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 3;
        this.recognition.lang = 'en-US';
        
        this.recognition.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                const confidence = event.results[i][0].confidence;
                
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                    if (this.onTranscription) {
                        this.onTranscription(finalTranscript, confidence, true);
                    }
                } else {
                    interimTranscript += transcript;
                    if (this.onTranscription) {
                        this.onTranscription(interimTranscript, confidence, false);
                    }
                }
            }
        };
        
        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            if (this.onError) {
                this.onError(event.error);
            }
        };
        
        this.recognition.start();
    }

    // Text-to-Speech with advanced options
    async speak(text, options = {}) {
        const {
            voice = 'default',
            rate = 1.0,
            pitch = 1.0,
            volume = 1.0,
            emotion = 'neutral'
        } = options;

        // Use Web Speech API as fallback
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Set voice properties
        utterance.rate = rate;
        utterance.pitch = pitch;
        utterance.volume = volume;
        
        // Select voice
        const voices = this.synthesis.getVoices();
        if (voice !== 'default') {
            const selectedVoice = voices.find(v => v.name.includes(voice));
            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }
        }
        
        return new Promise((resolve, reject) => {
            utterance.onend = resolve;
            utterance.onerror = reject;
            this.synthesis.speak(utterance);
        });
    }

    // WebSocket connection for real-time streaming
    connectWebSocket(url) {
        this.websocket = new WebSocket(url);
        
        this.websocket.onopen = () => {
            console.log('WebSocket connected');
        };
        
        this.websocket.onmessage = (event) => {
            if (this.onServerResponse) {
                this.onServerResponse(event.data);
            }
        };
        
        this.websocket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
        
        this.websocket.onclose = () => {
            console.log('WebSocket disconnected');
            // Attempt reconnection
            setTimeout(() => this.connectWebSocket(url), 5000);
        };
    }

    // Get audio visualization data
    getVisualizationData() {
        if (!this.analyser) return new Uint8Array(128);
        
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        this.analyser.getByteFrequencyData(dataArray);
        
        return dataArray;
    }

    // Get audio blob
    getAudioBlob() {
        return new Blob(this.audioChunks, { type: 'audio/webm' });
    }

    // Cleanup
    destroy() {
        if (this.vadProcessor) {
            clearInterval(this.vadProcessor);
        }
        
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }
        
        if (this.audioContext) {
            this.audioContext.close();
        }
        
        if (this.websocket) {
            this.websocket.close();
        }
        
        if (this.recognition) {
            this.recognition.stop();
        }
    }
}

export default VoiceService;
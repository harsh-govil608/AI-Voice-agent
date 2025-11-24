/*import axios from "axios";
import OpenAI from "openai";
export const getToken= async()=>{
    const result=await axios.get('api/gettoken');
    return result.data;
}
const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: "${API_KEY_REF}",
})
export const AIModel= async(topic, coachingOption, msg)=>{
    const option=CoachingOptions.find((item)=>item.name==coachingOption);
    const PROMPT=(option.prompt).replace('{user.topic}',topic);
    const completion = await openai.chat.completions.create({
        model: "google/gemini-2.0-flash-thinking-exp-1219:free",
        messages: [
            {role:'assistant',content:PROMPT},
            {role: "user", content: msg}
        ],
    })
    return completion.choices[0].message;
}
const ConvertTextToSpeech=async(text, expertName)=>{
    const pollyClient=new PollyClient({
        region: 'us-east-1',
        credentials:{
            accessKeyId:process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
            secretAccessKey:process.env.NEXT_PUBLIC_AWS_SECRET_KEY
        }
    })
    const command=new SynthesizeSpeechCommand({
        Text: text,
        OutputFormat: 'mp3',
        VoiceId:expertName
    })
    try{
        const {audioStream}=await pollyClient.send(command);
        const audioArrayBuffer=await audioStream.transformToByteArray();
        const audioBlob=new Blob([audioArrayBuffer],{type:'audio/mp3'});
        const audioUrl=URL.createObjectURL(audioBlob);
        return audioUrl;
    }catch(e){
        console.log(e);
    }

}*/
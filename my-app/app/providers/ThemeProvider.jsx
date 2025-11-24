"use client"
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

const ThemeContext = createContext({
    theme: 'dark',
    backgroundStyle: 'gradient',
    primaryColor: '#6366F1',
    accentColor: '#10B981',
    setTheme: () => {},
    setBackgroundStyle: () => {},
    setColors: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export default function ThemeProvider({ children }) {
    const [theme, setThemeState] = useState('dark');
    const [backgroundStyle, setBackgroundStyleState] = useState('gradient');
    const [primaryColor, setPrimaryColor] = useState('#6366F1');
    const [accentColor, setAccentColor] = useState('#10B981');
    
    const userEmail = "user@example.com"; // Replace with actual user email
    
    // Fetch user preferences
    const preferences = useQuery(api.users.getUserPreferences, { email: userEmail });
    const updateThemeMutation = useMutation(api.users.updateTheme);
    const updateBackgroundMutation = useMutation(api.users.updateBackgroundStyle);
    
    // Load preferences from database
    useEffect(() => {
        if (preferences) {
            setThemeState(preferences.theme);
            setBackgroundStyleState(preferences.backgroundStyle);
            setPrimaryColor(preferences.primaryColor);
            setAccentColor(preferences.accentColor);
            
            // Apply theme to document
            if (preferences.theme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    }, [preferences]);
    
    // Apply theme colors as CSS variables
    useEffect(() => {
        document.documentElement.style.setProperty('--primary-color', primaryColor);
        document.documentElement.style.setProperty('--accent-color', accentColor);
    }, [primaryColor, accentColor]);
    
    const setTheme = async (newTheme) => {
        setThemeState(newTheme);
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        
        // Save to database
        await updateThemeMutation({
            email: userEmail,
            theme: newTheme
        });
    };
    
    const setBackgroundStyle = async (style) => {
        setBackgroundStyleState(style);
        
        // Save to database
        await updateBackgroundMutation({
            email: userEmail,
            backgroundStyle: style
        });
    };
    
    const setColors = async (primary, accent) => {
        setPrimaryColor(primary);
        setAccentColor(accent);
        
        // Save to database
        await updateBackgroundMutation({
            email: userEmail,
            backgroundStyle: backgroundStyle,
            primaryColor: primary,
            accentColor: accent
        });
    };
    
    // Generate background based on style
    const getBackgroundClass = () => {
        switch (backgroundStyle) {
            case 'gradient':
                return theme === 'dark' 
                    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
                    : 'bg-gradient-to-br from-gray-50 via-white to-gray-100';
            case 'mesh':
                return theme === 'dark'
                    ? 'bg-gray-900 bg-mesh-dark'
                    : 'bg-white bg-mesh-light';
            case 'solid':
                return theme === 'dark' ? 'bg-gray-900' : 'bg-white';
            case 'animated':
                return theme === 'dark'
                    ? 'bg-gray-900 bg-animated-gradient-dark'
                    : 'bg-white bg-animated-gradient-light';
            default:
                return theme === 'dark' ? 'bg-gray-900' : 'bg-white';
        }
    };
    
    return (
        <ThemeContext.Provider value={{
            theme,
            backgroundStyle,
            primaryColor,
            accentColor,
            setTheme,
            setBackgroundStyle,
            setColors,
            getBackgroundClass
        }}>
            <div className={`min-h-screen transition-all duration-300 ${getBackgroundClass()}`}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
}
"use client"
import React, { useState } from 'react';
import { useTheme } from '@/app/providers/ThemeProvider';
import { Moon, Sun, Palette, Settings2, Sparkles, Grid3X3, Square, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

export default function ThemeToggle() {
    const { theme, backgroundStyle, primaryColor, accentColor, setTheme, setBackgroundStyle, setColors } = useTheme();
    const [showColorPicker, setShowColorPicker] = useState(false);
    
    const backgroundStyles = [
        { name: 'gradient', icon: Sparkles, label: 'Gradient' },
        { name: 'mesh', icon: Grid3X3, label: 'Mesh' },
        { name: 'solid', icon: Square, label: 'Solid' },
        { name: 'animated', icon: Zap, label: 'Animated' },
    ];
    
    const colorPresets = [
        { primary: '#6366F1', accent: '#10B981', name: 'Default' },
        { primary: '#8B5CF6', accent: '#EC4899', name: 'Purple' },
        { primary: '#3B82F6', accent: '#06B6D4', name: 'Ocean' },
        { primary: '#F59E0B', accent: '#EF4444', name: 'Sunset' },
        { primary: '#10B981', accent: '#14B8A6', name: 'Forest' },
        { primary: '#EC4899', accent: '#F43F5E', name: 'Rose' },
    ];
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button 
                    variant="ghost" 
                    size="icon"
                    className="relative group"
                >
                    {theme === 'dark' ? (
                        <Moon className="h-5 w-5 transition-transform group-hover:rotate-12" />
                    ) : (
                        <Sun className="h-5 w-5 transition-transform group-hover:rotate-45" />
                    )}
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex items-center gap-2">
                    <Settings2 className="h-4 w-4" />
                    Appearance Settings
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* Theme Toggle */}
                <DropdownMenuItem 
                    onClick={() => setTheme('light')}
                    className="flex items-center justify-between"
                >
                    <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        Light Mode
                    </div>
                    {theme === 'light' && <Badge variant="secondary">Active</Badge>}
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                    onClick={() => setTheme('dark')}
                    className="flex items-center justify-between"
                >
                    <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        Dark Mode
                    </div>
                    {theme === 'dark' && <Badge variant="secondary">Active</Badge>}
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                {/* Background Style */}
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        Background Style
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                        {backgroundStyles.map((style) => {
                            const Icon = style.icon;
                            return (
                                <DropdownMenuItem
                                    key={style.name}
                                    onClick={() => setBackgroundStyle(style.name)}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-2">
                                        <Icon className="h-4 w-4" />
                                        {style.label}
                                    </div>
                                    {backgroundStyle === style.name && (
                                        <Badge variant="secondary" className="ml-2">Active</Badge>
                                    )}
                                </DropdownMenuItem>
                            );
                        })}
                    </DropdownMenuSubContent>
                </DropdownMenuSub>
                
                {/* Color Presets */}
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="flex items-center gap-2">
                        <div className="flex gap-1">
                            <div 
                                className="w-4 h-4 rounded-full border" 
                                style={{ backgroundColor: primaryColor }}
                            />
                            <div 
                                className="w-4 h-4 rounded-full border" 
                                style={{ backgroundColor: accentColor }}
                            />
                        </div>
                        Color Theme
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                        {colorPresets.map((preset) => (
                            <DropdownMenuItem
                                key={preset.name}
                                onClick={() => setColors(preset.primary, preset.accent)}
                                className="flex items-center justify-between"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-1">
                                        <div 
                                            className="w-4 h-4 rounded-full border" 
                                            style={{ backgroundColor: preset.primary }}
                                        />
                                        <div 
                                            className="w-4 h-4 rounded-full border" 
                                            style={{ backgroundColor: preset.accent }}
                                        />
                                    </div>
                                    {preset.name}
                                </div>
                                {primaryColor === preset.primary && accentColor === preset.accent && (
                                    <Badge variant="secondary">Active</Badge>
                                )}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuSubContent>
                </DropdownMenuSub>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
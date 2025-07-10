
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';

const LoadingDots: React.FC = () => (
    <div className="flex justify-center items-center space-x-2">
        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
    </div>
);


const WelcomePage: React.FC = () => {
    const navigate = useNavigate();
    const { settings } = useData();
    const [phase, setPhase] = useState<'loading' | 'title' | 'subtitle' | 'benefits' | 'fading'>('loading');

    useEffect(() => {
        const originalBodyColor = document.body.style.backgroundColor;
        // Force a dark background on the body to prevent a white flash during transition.
        // #0D1117 is the 'background-dark' color from tailwind.config.js
        document.body.style.backgroundColor = '#0D1117';

        // Animation sequence for a total of 5 seconds
        const timer1 = setTimeout(() => setPhase('title'), 500);       // Show title
        const timer2 = setTimeout(() => setPhase('subtitle'), 1500);    // Show subtitle
        const timer3 = setTimeout(() => setPhase('benefits'), 2500);    // Show benefits
        const timer4 = setTimeout(() => setPhase('fading'), 4000);      // Start fading out
        const timer5 = setTimeout(() => {
            navigate('/home', { replace: true });
        }, 5000); // Navigate after fade out

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            clearTimeout(timer4);
            clearTimeout(timer5);
            // Restore original body background so the ThemeProvider can manage it.
            document.body.style.backgroundColor = originalBodyColor;
        };
    }, [navigate]);

    const isVisible = (targetPhase: 'title' | 'subtitle' | 'benefits') => {
        const phases: Array<typeof phase> = ['title', 'subtitle', 'benefits'];
        const currentPhaseIndex = phases.indexOf(phase as any);
        const targetPhaseIndex = phases.indexOf(targetPhase);
        return currentPhaseIndex >= targetPhaseIndex;
    };

    return (
        <div className={`flex items-center justify-center min-h-screen bg-primary-dark text-white overflow-hidden transition-opacity duration-1000 ${phase === 'fading' ? 'opacity-0' : 'opacity-100'}`}>
            <div className="text-center p-4">
                <h1 
                    className={`text-5xl font-extrabold tracking-tight transition-all duration-1000 ease-in-out ${isVisible('title') ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
                >
                    {settings.shopName}
                </h1>
                
                <p 
                    className={`text-lg text-gray-300 mt-4 max-w-2xl mx-auto transition-all duration-1000 ease-in-out delay-200 ${isVisible('subtitle') ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
                >
                    {settings.heroSubtitle}
                </p>

                <div 
                    className={`transition-opacity duration-1000 ease-in-out delay-500 ${isVisible('benefits') ? 'opacity-100' : 'opacity-0'}`}
                >
                    <p className="mt-8 text-xl text-accent">Experience shopping reimagined.</p>
                </div>

                <div className={`absolute bottom-16 left-0 right-0 transition-opacity duration-500 ${phase === 'loading' ? 'opacity-100' : 'opacity-0'}`}>
                    <LoadingDots />
                </div>
            </div>
        </div>
    );
};

export default WelcomePage;

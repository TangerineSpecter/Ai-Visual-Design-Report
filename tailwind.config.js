/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}", // 告诉 Tailwind 去哪里扫描 class
    ],
    theme: {
        extend: {
            // 把你原来 HTML 里的自定义配置粘贴到这里！
            colors: {
                n8n: {
                    light: '#ff8f8f',
                    DEFAULT: '#ff4d4d',
                    dark: '#cc0000',
                },
                darkbg: '#0f172a',
                cardbg: '#1e293b'
            },
            animation: {
                'dash': 'dash 2s linear infinite',
                'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'shred': 'shred 2s ease-in-out infinite',
                'orbit': 'orbit 8s linear infinite',
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
            },
            keyframes: {
                dash: {
                    '0%': { strokeDashoffset: '20' },
                    '100%': { strokeDashoffset: '0' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                shred: {
                    '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
                    '50%': { opacity: '0', transform: 'translateY(20px) scale(0.8)' },
                    '100%': { opacity: '0', transform: 'translateY(20px) scale(0.8)' },
                },
                orbit: {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                },
                pulseGlow: {
                    '0%, 100%': { boxShadow: '0 0 5px #ff4d4d' },
                    '50%': { boxShadow: '0 0 20px #ff4d4d' },
                }
            }
        },
    },
    plugins: [],
}

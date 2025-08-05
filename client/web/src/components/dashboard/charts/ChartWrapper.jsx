import { useEffect, useRef } from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    LineElement,
    PointElement,
} from 'chart.js';
import { Pie, Bar, Doughnut, Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    LineElement,
    PointElement
);

export default function ChartWrapper({ type, data, options }) {
    const chartRef = useRef(null);
    const canvasRef = useRef(null);

    // Cleanup on unmount or type change
    useEffect(() => {
        return () => {
            if (chartRef.current) {
                try {
                    chartRef.current.destroy();
                } catch (e) {
                    console.log('Chart cleanup:', e);
                }
                chartRef.current = null;
            }
        };
    }, [type]);

    const getChart = () => {
        const commonProps = {
            ref: canvasRef,
            data,
            options: {
                ...options,
                onReady: (chart) => {
                    chartRef.current = chart;
                }
            }
        };

        switch (type) {
            case 'pie':
                return <Pie {...commonProps} />;
            case 'doughnut':
                return <Doughnut {...commonProps} />;
            case 'bar':
                return <Bar {...commonProps} />;
            case 'line':
                return <Line {...commonProps} />;
            default:
                return <Pie {...commonProps} />;
        }
    };

    return (
        <div className="w-full h-full">
            {getChart()}
        </div>
    );
}

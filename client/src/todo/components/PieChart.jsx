import { useEffect, useRef, useState } from 'react';
import { Chart } from 'chart.js/auto';

export default function PieChart({ data, chartType }) {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);
    const [currentData, setCurrentData] = useState([]);

    useEffect(() => {
        setCurrentData(data);
    }, [data]);

    useEffect(() => {
        if (!chartRef.current || !currentData?.length) return;

        const ctx = chartRef.current.getContext('2d');
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        chartInstanceRef.current = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: currentData.map(item => item.category),
                datasets: [{
                    label: 'הוצאות',
                    data: currentData.map(item => item.amount),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                        'rgba(255, 159, 64, 0.6)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        rtl: true
                    },
                    title: {
                        display: true,
                        text: chartType === 'account' ? 'התפלגות הוצאות לפי פרופילים' : 'התפלגות הוצאות לפי קטגוריות',
                        font: { size: 16 }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed !== null) {
                                    label += new Intl.NumberFormat('he-IL', { 
                                        style: 'currency', 
                                        currency: 'ILS' 
                                    }).format(context.parsed);
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, [currentData, chartType]);

    return (
        <div className="flex flex-col md:flex-row justify-between w-full gap-4">
            <div className="w-full md:w-1/2 bg-white p-4 rounded-lg shadow">
                <div className="h-[300px] md:h-[400px]">
                    <canvas ref={chartRef}></canvas>
                </div>
            </div>
            <div className="w-full md:w-1/2 bg-white p-4 rounded-lg shadow overflow-auto">
                <h3 className="text-lg font-semibold mb-4">
                    סכום הוצאות לפי {chartType === 'account' ? 'פרופיל' : 'קטגוריה'}
                </h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 text-right">
                                    {chartType === 'account' ? 'פרופיל' : 'קטגוריה'}
                                </th>
                                <th className="py-2 px-4 text-right">סכום</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.map((item, index) => (
                                <tr key={index} className="border-b">
                                    <td className="py-2 px-4 text-right">{item.category}</td>
                                    <td className="py-2 px-4 text-right">
                                        {new Intl.NumberFormat('he-IL', { 
                                            style: 'currency', 
                                            currency: 'ILS' 
                                        }).format(item.amount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
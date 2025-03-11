import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

export default function PieChart({ data }) {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {
        const ctx = chartRef.current.getContext('2d');
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        chartInstanceRef.current = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: data.map(item => item.category),
                datasets: [{
                    label: 'הוצאות',
                    data: data.map(item => item.amount),
                    backgroundColor: [
                        '#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40'
                    ],
                    borderColor: ['#fff', '#fff', '#fff', '#fff', '#fff', '#fff'],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: {
                                size: 14
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) label += ': ';
                                if (context.parsed !== null) {
                                    label += new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(context.parsed);
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
    }, [data]);

    return (
        <div className="flex flex-col lg:flex-row justify-center items-center gap-6 p-6 bg-white shadow-md rounded-lg w-full max-w-5xl mx-auto">
            
            {/* קונטיינר לגרף עוגה */}
            <div className="w-full lg:w-1/2 h-72 flex justify-center">
                <canvas ref={chartRef}></canvas>
            </div>

            {/* קונטיינר לטבלה עם גלילה אופקית */}
            <div className="w-full lg:w-1/2 bg-gray-50 p-4 rounded-md shadow-lg overflow-x-auto">
                <h3 className="text-xl font-semibold text-blue-600 mb-4 text-center">סכום הוצאות לפי קטגוריה</h3>
                
                {/* גלילה במסכים קטנים */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[350px] text-center border border-gray-300 rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-blue-500 text-white">
                                <th className="py-3 px-4">קטגוריה</th>
                                <th className="py-3 px-4">סכום</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={index} className="border-b border-gray-200 hover:bg-gray-100 transition">
                                    <td className="py-3 px-4">{item.category}</td>
                                    <td className="py-3 px-4 font-medium">
                                        {new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(item.amount)}
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

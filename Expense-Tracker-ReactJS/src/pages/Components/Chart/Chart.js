import React from 'react'
import {
    Chart as ChartJs,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js'

import { Line } from 'react-chartjs-2'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext'
import { dateFormat } from '../../utils/dateFormat'

ChartJs.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
)

function Chart() {
    const { incomes, expenses } = useGlobalContext();

    // Create data for chart with improved handling
    const createChartData = () => {
        // Get all unique dates from both incomes and expenses
        const allDates = [
            ...incomes.map(item => item.date),
            ...expenses.map(item => item.date)
        ]

        // Create array of unique dates, sort chronologically
        const uniqueDates = [...new Set(allDates)]
            .sort((a, b) => new Date(a) - new Date(b))
            .map(date => dateFormat(date));

        // Handle empty data case
        if (uniqueDates.length === 0) {
            return {
                labels: ['No data available'],
                datasets: [
                    {
                        label: 'Income',
                        data: [0],
                        backgroundColor: 'green',
                        borderColor: 'rgba(0, 128, 0, 0.6)',
                        tension: .2
                    },
                    {
                        label: 'Expenses',
                        data: [0],
                        backgroundColor: 'red',
                        borderColor: 'rgba(255, 0, 0, 0.6)',
                        tension: .2
                    }
                ]
            }
        }

        /* const data = {
            labels: incomes.map((inc) =>{
                const {date} = inc
                return dateFormat(date)
            }), */

        // Create data structure for chart
        return {
            labels: uniqueDates,
            datasets: [
                {
                    label: 'Income',
                    data: uniqueDates.map(formattedDate => {
                        // Find income amount for this date (if any)
                        const matchingIncome = incomes.find(income =>
                            dateFormat(income.date) === formattedDate
                        )
                        return matchingIncome ? matchingIncome.amount : 0
                    }),
                    backgroundColor: 'green',
                    borderColor: 'rgba(0, 128, 0, 0.6)',
                    tension: .2,
                    fill: false
                },
                {
                    label: 'Expenses',
                    data: uniqueDates.map(formattedDate => {
                        // Find expense amount for this date (if any)
                        const matchingExpense = expenses.find(expense =>
                            dateFormat(expense.date) === formattedDate
                        )
                        return matchingExpense ? matchingExpense.amount : 0
                    }),
                    backgroundColor: 'red',
                    borderColor: 'rgba(255, 0, 0, 0.6)',
                    tension: .2,
                    fill: false
                }
            ]
        }
    }

    // Options to enhance chart display
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Amount (₹)'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Date'
                }
            }
        },
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += '₹' + context.parsed.y;
                        }
                        return label;
                    }
                }
            }
        }
    }

    /* datasets: [
        {
            label: 'Income',
            data: [
                ...incomes.map((income) => {
                    const {amount} = income
                    return amount
                })
            ],
            backgroundColor: 'green',
            tension: .2
        },
        {
            label: 'Expenses',
            data: [
                ...expenses.map((expense) => {
                    const {amount} = expense
                    return amount
                })
            ],
            backgroundColor: 'red',
            tension: .2
        }
    ]
} */

    return (
        <ChartStyled>
            {incomes.length === 0 && expenses.length === 0 ? (
                <div className="no-data">
                    <p>Add income or expenses to see your financial chart</p>
                </div>
            ) : (
                <Line data={createChartData()} options={options} />
            )}
        </ChartStyled>
    )
}


/* return (
    <ChartStyled >
        <Line data={data} />
    </ChartStyled>
)
} */

const ChartStyled = styled.div`
    background: #FCF6F9;
    border: 2px solid #FFFFFF;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    padding: 1rem;
    border-radius: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    
    .no-data {
        text-align: center;
        color: rgba(34, 34, 96, 0.6);
        padding: 2rem;
    }
`;

export default Chart
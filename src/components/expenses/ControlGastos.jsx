import { LineChart } from '@mui/x-charts/LineChart';
import { useEffect, useState } from 'react';

export default function ControlGastos() {
    const [gastos, setGastos] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3002/api/gastos')
            .then(response => response.json())
            .then(data => setGastos(data));
    }, []);

    return (
        <div>
            <LineChart
                xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                series={[
                    {
                        data: [2, 5.5, 2, 8.5, 1.5, 5],
                        area: true,
                    },
                ]}
                height={300}
                margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
            />
        </div>
    )
}
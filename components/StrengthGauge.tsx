import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface StrengthGaugeProps {
  score: number;
}

const StrengthGauge: React.FC<StrengthGaugeProps> = ({ score }) => {
  // Determine color based on score
  let fill = '#ef4444'; // red-500
  if (score > 40) fill = '#eab308'; // yellow-500
  if (score > 70) fill = '#22c55e'; // green-500
  if (score > 90) fill = '#3b82f6'; // blue-500

  const data = [{ name: 'Score', value: score, fill }];

  return (
    <div className="w-full h-64 relative flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart 
          cx="50%" 
          cy="50%" 
          innerRadius="70%" 
          outerRadius="100%" 
          barSize={20} 
          data={data} 
          startAngle={180} 
          endAngle={0}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            background={{ fill: '#334155' }}
            dataKey="value"
            cornerRadius={10}
            fill={fill}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/3 text-center">
        <span className="text-5xl font-bold text-slate-100">{score}</span>
        <span className="block text-slate-400 text-sm font-medium mt-1">/ 100</span>
      </div>
      <div className="absolute bottom-4 text-slate-300 font-medium">
        Security Score
      </div>
    </div>
  );
};

export default StrengthGauge;
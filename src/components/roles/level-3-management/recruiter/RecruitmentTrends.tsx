"use client";

import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

export interface TrendData {
  name: string;
  applicants: number;
  shortlisted: number;
}

export function RecruitmentTrends({ data }: { data: TrendData[] }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="h-[200px] w-full mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorShort" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#6b7280' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(15, 23, 42, 0.9)', 
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              fontSize: '10px'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="applicants" 
            stroke="#6366f1" 
            fillOpacity={1} 
            fill="url(#colorApps)" 
            strokeWidth={2}
          />
          <Area 
            type="monotone" 
            dataKey="shortlisted" 
            stroke="#10b981" 
            fillOpacity={1} 
            fill="url(#colorShort)" 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

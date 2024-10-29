// src/components/news/polarisation-view.tsx
'use client';

import { Story } from '@/types/news';
import { AlertTriangle, MessageCircle, Quote, TrendingUp } from 'lucide-react';

interface PolarisationViewProps {
  story: Story;
}

export function PolarisationView({ story }: PolarisationViewProps) {
  const {
    level,
    supporting,
    opposing,
    neutral,
    contentionPoints = [],
    notableStatements = []
  } = story.polarization;

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'High': return 'red';
      case 'Moderate': return 'orange';
      case 'Low': return 'green';
      default: return 'gray';
    }
  };

  const color = getLevelColor(level);

  return (
    <div className="space-y-6">
      {/* Polarization Level */}
      <div className={`bg-${color}-50 rounded-lg p-4`}>
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className={`w-4 h-4 text-${color}-600`}/>
          <span className={`text-sm font-medium text-${color}-600`}>
            {level} Polarised Topic
          </span>
        </div>
        <div className="space-y-2">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="flex h-full">
              <div className="h-full bg-blue-500" style={{width: `${supporting}%`}}/>
              <div className="h-full bg-gray-300" style={{width: `${neutral}%`}}/>
              <div className="h-full bg-red-500" style={{width: `${opposing}%`}}/>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Supporting Sources ({supporting}%)</span>
            <span>Neutral ({neutral}%)</span>
            <span>Opposing Sources ({opposing}%)</span>
          </div>
        </div>
      </div>

      {/* Key Points of Contention */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="w-4 h-4 text-gray-600"/>
          <h2 className="font-medium">Key Points of Contention</h2>
        </div>
        
        <div className="space-y-4">
          {contentionPoints.map((point, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium mb-3">{point.topic}</h3>
              <div className="space-y-4">
                <div className="pl-3 border-l-2 border-blue-400">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-4 h-4 rounded-full bg-blue-100"/>
                    <span className="text-xs font-medium">Supporting View</span>
                  </div>
                  <p className="text-sm text-gray-600">"{point.supportingView.text}"</p>
                  <div className="mt-1 text-xs text-gray-400">{point.supportingView.source}</div>
                </div>

                <div className="pl-3 border-l-2 border-red-400">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-4 h-4 rounded-full bg-red-100"/>
                    <span className="text-xs font-medium">Opposing View</span>
                  </div>
                  <p className="text-sm text-gray-600">"{point.opposingView.text}"</p>
                  <div className="mt-1 text-xs text-gray-400">{point.opposingView.source}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notable Statements */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Quote className="w-4 h-4 text-gray-600"/>
          <h2 className="font-medium">Notable Statements</h2>
        </div>
        
        <div className="space-y-3">
          {notableStatements.map((statement, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 italic mb-2">
                "{statement.quote}"
              </p>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-purple-100"/>
                <span className="text-xs text-gray-500">{statement.source}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
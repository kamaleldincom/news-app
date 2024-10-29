// src/components/news/timeline-view.tsx
'use client';

import { DayEvents, TimelineEvent, CoverageTrend } from '@/types/news';
import { AlertCircle, ExternalLink, TrendingUp } from 'lucide-react';

type TimelineViewProps = {
  days: DayEvents[];
  latestUpdate: TimelineEvent;
  coverageTrend: CoverageTrend[];
};

export function TimelineView({ days, latestUpdate, coverageTrend }: TimelineViewProps) {
  return (
    <div className="space-y-6">
      {/* Latest Update Banner */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="w-4 h-4 text-blue-600"/>
          <span className="text-xs font-medium text-blue-600">LATEST UPDATE</span>
        </div>
        <p className="text-sm">{latestUpdate.description}</p>
      </div>

      {/* Timeline */}
      <div className="space-y-8">
        {days.map((day) => (
          <div key={day.date}>
            <div className="sticky top-0 bg-white py-2 mb-4">
              <div className="text-sm font-medium">{day.label}</div>
              <div className="text-xs text-gray-500">{day.formattedDate}</div>
            </div>
            
            <div className="space-y-6">
              {day.events.map((event) => (
                <div key={event.id} className="relative pl-6 border-l-2 border-blue-100">
                  <div className={`absolute w-3 h-3 ${
                    day.isToday ? 'bg-blue-500' : 'bg-gray-300'
                  } rounded-full -left-[7px] top-0`}/>
                  <div className="space-y-2">
                    <span className="text-xs text-gray-500">{event.time}</span>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium mb-2">{event.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full bg-${event.source.color}-100`}/>
                        <a 
                          href={event.source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 flex items-center gap-1 hover:underline"
                        >
                          {event.source.name}
                          <ExternalLink className="w-3 h-3"/>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Coverage Trend Analysis */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-gray-600"/>
          <h2 className="font-medium">Coverage Trend</h2>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-3">
            Coverage has shifted from initial {coverageTrend[0].sentiment} reports to 
            {coverageTrend[1].sentiment} coverage as developments unfolded. 
            {coverageTrend[1].description}
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500"/>
              <span className="text-xs text-gray-500">Initial Reports</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500"/>
              <span className="text-xs text-gray-500">Current Coverage</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
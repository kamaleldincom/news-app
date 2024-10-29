// src/lib/timeline-service.ts

import { TimelineEvent, DayEvents, CoverageTrend, SourceBias } from '@/types/news';
import { format, isSameDay, parseISO, differenceInDays } from 'date-fns';

export class TimelineService {
  private static instance: TimelineService;

  private constructor() {}

  public static getInstance(): TimelineService {
    if (!TimelineService.instance) {
      TimelineService.instance = new TimelineService();
    }
    return TimelineService.instance;
  }

  public processTimelineEvents(events: TimelineEvent[]): {
    days: DayEvents[];
    latestUpdate: TimelineEvent;
    coverageTrend: CoverageTrend[];
  } {
    // Sort events by timestamp
    const sortedEvents = [...events].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Group by day
    const groupedByDay = sortedEvents.reduce<Record<string, DayEvents>>((acc, event) => {
      const date = parseISO(event.timestamp);
      const dateKey = format(date, 'yyyy-MM-dd');
      
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: dateKey,
          formattedDate: format(date, 'MMMM d, yyyy'),
          label: this.getDayLabel(date),
          isToday: isSameDay(date, new Date()),
          events: []
        };
      }
      
      // Create a new event object with the time property
      const eventWithTime: TimelineEvent = {
        ...event,
        time: format(parseISO(event.timestamp), 'HH:mm z')
      };
      
      acc[dateKey].events.push(eventWithTime);
      
      return acc;
    }, {});

    // Rest of the implementation remains the same...
    const days = Object.values(groupedByDay).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return {
      days,
      latestUpdate: sortedEvents[0],
      coverageTrend: this.analyzeCoverageTrend(sortedEvents)
    };
  }

  private getDayLabel(date: Date): string {
    const daysDiff = differenceInDays(new Date(), date);
    if (daysDiff === 0) return 'Today';
    if (daysDiff === 1) return 'Yesterday';
    return `Day ${daysDiff + 1}`;
  }

  private analyzeCoverageTrend(events: TimelineEvent[]): CoverageTrend[] {
    const initialEvents = events.slice(-3); // Last 3 events
    const currentEvents = events.slice(0, 3); // First 3 events

    return [
      {
        period: 'initial',
        date: initialEvents[0]?.timestamp || '',
        sentiment: this.analyzeSentiment(initialEvents),
        mainSources: this.extractMainSources(initialEvents),
        description: this.generateTrendDescription(initialEvents)
      },
      {
        period: 'current',
        date: currentEvents[0]?.timestamp || '',
        sentiment: this.analyzeSentiment(currentEvents),
        mainSources: this.extractMainSources(currentEvents),
        description: this.generateTrendDescription(currentEvents)
      }
    ];
  }

  private analyzeSentiment(events: TimelineEvent[]): 'skeptical' | 'neutral' | 'concerned' {
    // Count sources with explicit biases
    const sourceBiases = events.map(e => e.source.bias || this.inferSourceBias(e.source.name));
    const opposing = sourceBiases.filter(b => b === 'opposing').length;
    const supporting = sourceBiases.filter(b => b === 'supporting').length;
    
    if (opposing > supporting) return 'skeptical';
    if (opposing < supporting) return 'concerned';
    return 'neutral';
  }

  private inferSourceBias(sourceName: string): SourceBias {
    // Add source bias mapping based on your requirements
    const sourceBiases: Record<string, SourceBias> = {
      'Reuters': 'neutral',
      'Associated Press': 'neutral',
      'TASS': 'supporting',
      'KCNA': 'supporting',
      // Add more sources as needed
    };
    return sourceBiases[sourceName] || 'neutral';
  }

  private extractMainSources(events: TimelineEvent[]): string[] {
    return Array.from(new Set(events.map(e => e.source.name)));
  }

  private generateTrendDescription(events: TimelineEvent[]): string {
    const sentiment = this.analyzeSentiment(events);
    const mainSources = this.extractMainSources(events);
    
    switch (sentiment) {
      case 'skeptical':
        return `Coverage shows skepticism from ${mainSources.join(', ')} about the developments.`;
      case 'concerned':
        return `Reports from ${mainSources.join(', ')} indicate growing concerns.`;
      default:
        return `Balanced coverage from ${mainSources.join(', ')}.`;
    }
  }
}

export default TimelineService;
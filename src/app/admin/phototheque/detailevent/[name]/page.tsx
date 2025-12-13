import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CONFIG } from 'src/global-config';
import { _eventList } from 'src/_mock/_events';
import { IEventItem } from 'src/types/event';
import { kebabCase } from 'es-toolkit';
import { PhotothequeEventDetail } from 'src/sections/phototheque/detailevent/event-detail';

// Move getEvent logic to a utility function
const fetchEvent = async (name: string): Promise<{
  event: IEventItem | null;
  error: string | null;
}> => {
  try {
    const event = _eventList.find((event) => kebabCase(event.name) === name);
   
    if (!event) {
      return {
        event: null,
        error: 'Event not found',
      };
    }
    return {
      event,
      error: null,
    };
  } catch (error) {
    return {
      event: null,
      error: error instanceof Error ? error.message : 'An error occurred',
    };
  }
};

export const metadata: Metadata = {
  title: `Event details | Admin - ${CONFIG.appName}`
};

type Props = {
  params: { name: string };
};

export default async function Page({ params }: Props) {
  const { name } = params;
  const { event, error } = await fetchEvent(name);

  if (error || !event) {
    notFound();
  }

  return <PhotothequeEventDetail event={event} />;
}

// Configuration for static export
const dynamic = CONFIG.isStaticExport ? 'auto' : 'force-dynamic';
export { dynamic };

export async function generateStaticParams() {
  if (CONFIG.isStaticExport) {
    return _eventList.map((event) => ({
      name: kebabCase(event.name)
    }));
  }
  return [];
}
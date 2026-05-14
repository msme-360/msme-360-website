import { google, Auth } from 'googleapis';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

export function getOAuth2Client(redirectUri?: string) {
  return new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    redirectUri || REDIRECT_URI
  );
}

export const oauth2Client = getOAuth2Client();

export async function createCalendarEvent(auth: Auth.OAuth2Client, eventDetails: {
  summary: string;
  description: string;
  startTime: string;
  endTime: string;
  attendees: string[];
  recurrence?: string[];
}) {
  const calendar = google.calendar({ version: 'v3', auth });

  const event: import('googleapis').calendar_v3.Schema$Event = {
    summary: eventDetails.summary,
    description: eventDetails.description,
    start: {
      dateTime: eventDetails.startTime,
      timeZone: 'UTC', 
    },
    end: {
      dateTime: eventDetails.endTime,
      timeZone: 'UTC',
    },
    attendees: eventDetails.attendees.map(email => ({ email })),
    conferenceData: {
      createRequest: {
        requestId: Math.random().toString(36).substring(7),
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    },
  };

  if (eventDetails.recurrence) {
    event.recurrence = eventDetails.recurrence;
  }

  const response = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: event,
    conferenceDataVersion: 1,
    sendUpdates: 'all',
  });

  return response.data;
}

export async function deleteCalendarEvent(auth: Auth.OAuth2Client, eventId: string) {
  const calendar = google.calendar({ version: 'v3', auth });
  try {
    await calendar.events.delete({
      calendarId: 'primary',
      eventId: eventId,
      sendUpdates: 'all',
    });
    return true;
  } catch (error) {
    console.error("Error deleting calendar event:", error);
    return false;
  }
}

export async function checkConflicts(auth: Auth.OAuth2Client, startTime: string, endTime: string) {
  const calendar = google.calendar({ version: 'v3', auth });
  try {
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: startTime,
      timeMax: endTime,
      singleEvents: true,
    });
    
    // Filter out cancelled events and events that don't block time
    const busyEvents = (response.data.items || []).filter(event => {
      return event.status !== 'cancelled' && event.transparency !== 'transparent';
    });
    
    return busyEvents;
  } catch (error) {
    console.error("Error checking calendar conflicts:", error);
    return [];
  }
}

export function getAuthUrl() {
  const scopes = [
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/userinfo.email',
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
  });
}

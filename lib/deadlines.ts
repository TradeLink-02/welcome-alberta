import { addMonths, addDays, differenceInDays, isPast, parseISO } from 'date-fns';
import type { ImmigrationStatus } from '../types/Profile';

export type DeadlineUrgency = 'overdue' | 'urgent' | 'upcoming';

export interface Deadline {
  id: string;
  stepId: string;
  label: string;
  dueDate: Date;
  daysRemaining: number;
  urgency: DeadlineUrgency;
}

function urgencyFromDays(days: number): DeadlineUrgency {
  if (days < 0) return 'overdue';
  if (days <= 30) return 'urgent';
  return 'upcoming';
}

export function calculateDeadlines(
  arrivalDate: string | null,
  immigrationStatus: ImmigrationStatus | null
): Deadline[] {
  if (!arrivalDate) return [];

  const arrival = parseISO(arrivalDate);
  const today = new Date();
  const deadlines: Deadline[] = [];

  // AHCIP: 3 months from arrival (waived for refugees)
  if (immigrationStatus !== 'refugee') {
    const ahcipDue = addMonths(arrival, 3);
    const days = differenceInDays(ahcipDue, today);
    deadlines.push({
      id: 'ahcip',
      stepId: 'step_2_ahcip',
      label: 'Apply for AHCIP health insurance',
      dueDate: ahcipDue,
      daysRemaining: days,
      urgency: urgencyFromDays(days),
    });
  }

  // Driver's licence exchange: 90 days
  const licenceDue = addDays(arrival, 90);
  const licenceDays = differenceInDays(licenceDue, today);
  deadlines.push({
    id: 'licence',
    stepId: 'step_8_licence',
    label: 'Exchange foreign driver\'s licence',
    dueDate: licenceDue,
    daysRemaining: licenceDays,
    urgency: urgencyFromDays(licenceDays),
  });

  // Tax filing: April 30 of the year after arrival
  const taxYear = arrival.getFullYear() + 1;
  const taxDue = new Date(taxYear, 3, 30); // April 30
  const taxDays = differenceInDays(taxDue, today);
  if (!isPast(taxDue)) {
    deadlines.push({
      id: 'taxes',
      stepId: 'step_7_taxes',
      label: 'File first Canadian tax return',
      dueDate: taxDue,
      daysRemaining: taxDays,
      urgency: urgencyFromDays(taxDays),
    });
  }

  return deadlines.sort((a, b) => a.daysRemaining - b.daysRemaining);
}

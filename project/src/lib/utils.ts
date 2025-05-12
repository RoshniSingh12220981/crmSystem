import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Combine class names with tailwind-merge
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

// Format date
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Evaluate segment rules against customer data
export function evaluateSegmentRules(
  customer: any,
  rules: Array<{
    field: string;
    operator: string;
    value: number;
  }>
): boolean {
  if (!rules || rules.length === 0) return true;

  return rules.every((rule) => {
    const field = rule.field;
    const operator = rule.operator;
    const value = rule.value;
    const customerValue = customer[field];

    switch (operator) {
      case 'gt':
        return customerValue > value;
      case 'gte':
        return customerValue >= value;
      case 'lt':
        return customerValue < value;
      case 'lte':
        return customerValue <= value;
      case 'eq':
        return customerValue === value;
      default:
        return false;
    }
  });
}
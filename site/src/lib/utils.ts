import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns";
import { az, enUS, ru } from "date-fns/locale";
import { ChildCharacteristic, GroupedCharacteristic, ParentCharacteristic } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const localeMap = {
  'az': az,
  'en': enUS,
  'ru': ru
}

export const formatDate = (date: string, locale: string) => {
  try {

    const dateFnsLocale = localeMap[locale as keyof typeof localeMap] || localeMap['az'];

    const formattedDate = format(new Date(date), "d MMMM yyyy, HH:mm", {
      locale: dateFnsLocale
    });

    return formattedDate;
  } catch (error) {
    console.error('Date formatting error:', error);
    return date; 
  }
}

export const extractTitlePrefix = (title: string, category: string) => {
  let prefix = title.replace(/\s+\d{4}\b/, '');

  const escapedCategory = category.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const categoryRegex = new RegExp(`\\b${escapedCategory}\\b`, 'i');
  prefix = prefix.replace(categoryRegex, '').trim();

  return prefix;
}



export function groupCharacteristicsWithChildren(
  parents: ParentCharacteristic[],
  children: ChildCharacteristic[]
): GroupedCharacteristic[] {
  return parents.map(parent => {
    const matchedChildren = children.filter(
      child => child.characteristic._id === parent._id
    );

    return {
      ...parent,
      children: matchedChildren
    };
  });
}
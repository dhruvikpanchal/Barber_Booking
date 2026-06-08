import { User, Scissors, Calendar, ClipboardList } from "lucide-react";

export const STEPS = [
  {
    id: "barber",
    label: "Barber",
    icon: User,
    title: "Choose your barber",
    sub: "Search by name, specialty, or service — then pick who you want to book with.",
  },
  {
    id: "services",
    label: "Services",
    icon: Scissors,
    title: "Choose services",
    sub: "Select one or more services for your visit.",
  },
  {
    id: "datetime",
    label: "Date",
    icon: Calendar,
    title: "Pick a date & time",
    sub: "Choose when you'd like to come in.",
  },
  {
    id: "summary",
    label: "Summary",
    icon: ClipboardList,
    title: "Review & confirm",
    sub: "Double-check your booking before confirming.",
  },
];

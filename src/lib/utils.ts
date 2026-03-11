import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function predictNeetRank(marks: number): number | string {
  const data = [
    { marks: 720, rank: 17 },
    { marks: 715, rank: 177 },
    { marks: 705, rank: 542 },
    { marks: 700, rank: 2250 },
    { marks: 690, rank: 4406 },
    { marks: 685, rank: 6232 },
    { marks: 675, rank: 11600 },
    { marks: 671, rank: 13923 },
    { marks: 665, rank: 17800 },
    { marks: 656, rank: 25500 },
    { marks: 650, rank: 29000 },
    { marks: 645, rank: 33848 },
    { marks: 638, rank: 40116 },
    { marks: 630, rank: 47810 },
    { marks: 627, rank: 51119 },
    { marks: 615, rank: 65000 },
    { marks: 606, rank: 70000 },
    { marks: 605, rank: 76000 },
    { marks: 603, rank: 77000 },
    { marks: 591, rank: 91527 },
    { marks: 550, rank: 144000 },
    { marks: 544, rank: 149119 },
    { marks: 511, rank: 193527 },
    { marks: 500, rank: 209000 },
    { marks: 451, rank: 285550 },
    { marks: 448, rank: 291306 },
    { marks: 414, rank: 351425 },
    { marks: 380, rank: 420000 },
    { marks: 331, rank: 565970 },
    { marks: 287, rank: 657138 },
    { marks: 251, rank: 774559 },
    { marks: 142, rank: 1200000 }
  ];

  if (marks < 140) {
    return "1200000+";
  }

  if (marks >= 720) {
    return "1 - 17";
  }

  for (let i = 0; i < data.length - 1; i++) {
    let m1 = data[i].marks;
    let r1 = data[i].rank;
    let m2 = data[i + 1].marks;
    let r2 = data[i + 1].rank;

    if (marks <= m1 && marks >= m2) {
      // linear interpolation
      let rank = r1 + (r2 - r1) * ((m1 - marks) / (m1 - m2));
      return Math.round(rank);
    }
  }

  return "Rank not available";
}

export function getDaysLeft(): number {
  const targetDate = new Date('2026-05-03T00:00:00');
  const now = new Date();
  const diffTime = targetDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

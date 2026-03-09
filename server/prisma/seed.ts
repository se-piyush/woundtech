import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Sample data for generating realistic entries
const firstNames = [
  "James",
  "Mary",
  "John",
  "Patricia",
  "Robert",
  "Jennifer",
  "Michael",
  "Linda",
  "William",
  "Barbara",
  "David",
  "Elizabeth",
  "Richard",
  "Susan",
  "Joseph",
  "Jessica",
  "Thomas",
  "Sarah",
  "Charles",
  "Karen",
  "Christopher",
  "Nancy",
  "Daniel",
  "Lisa",
  "Matthew",
  "Betty",
  "Anthony",
  "Margaret",
  "Mark",
  "Sandra",
  "Donald",
  "Ashley",
  "Steven",
  "Kimberly",
  "Paul",
  "Emily",
  "Andrew",
  "Donna",
  "Joshua",
  "Michelle",
  "Kenneth",
  "Dorothy",
  "Kevin",
  "Carol",
  "Brian",
  "Amanda",
  "George",
  "Melissa",
  "Edward",
  "Deborah",
  "Ronald",
  "Stephanie",
  "Timothy",
  "Rebecca",
  "Jason",
  "Sharon",
  "Jeffrey",
  "Laura",
  "Ryan",
  "Cynthia",
  "Jacob",
  "Kathleen",
  "Gary",
  "Amy",
  "Nicholas",
  "Shirley",
  "Eric",
  "Angela",
  "Jonathan",
  "Helen",
  "Stephen",
  "Anna",
  "Larry",
  "Brenda",
  "Justin",
  "Pamela",
  "Scott",
  "Nicole",
  "Brandon",
  "Emma",
  "Benjamin",
  "Samantha",
  "Samuel",
  "Katherine",
  "Raymond",
  "Christine",
  "Gregory",
  "Debra",
  "Frank",
  "Rachel",
  "Alexander",
  "Catherine",
  "Patrick",
  "Carolyn",
  "Raymond",
  "Janet",
  "Jack",
  "Ruth",
  "Dennis",
  "Maria",
  "Jerry",
  "Heather",
  "Tyler",
  "Diane",
];

const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
  "Lee",
  "Perez",
  "Thompson",
  "White",
  "Harris",
  "Sanchez",
  "Clark",
  "Ramirez",
  "Lewis",
  "Robinson",
  "Walker",
  "Young",
  "Allen",
  "King",
  "Wright",
  "Scott",
  "Torres",
  "Nguyen",
  "Hill",
  "Flores",
  "Green",
  "Adams",
  "Nelson",
  "Baker",
  "Hall",
  "Rivera",
  "Campbell",
  "Mitchell",
  "Carter",
  "Roberts",
  "Gomez",
  "Phillips",
  "Evans",
  "Turner",
  "Diaz",
  "Parker",
  "Cruz",
  "Edwards",
  "Collins",
  "Reyes",
  "Stewart",
  "Morris",
  "Morales",
  "Murphy",
  "Cook",
  "Rogers",
  "Gutierrez",
  "Ortiz",
  "Morgan",
  "Cooper",
  "Peterson",
  "Bailey",
  "Reed",
  "Kelly",
  "Howard",
  "Ramos",
  "Kim",
  "Cox",
  "Ward",
  "Richardson",
  "Watson",
  "Brooks",
  "Chavez",
  "Wood",
  "James",
  "Bennett",
  "Gray",
  "Mendoza",
  "Ruiz",
  "Hughes",
  "Price",
  "Alvarez",
  "Castillo",
  "Sanders",
  "Patel",
  "Myers",
  "Long",
  "Ross",
  "Foster",
  "Jimenez",
  "Powell",
  "Jenkins",
  "Perry",
  "Russell",
];

const specialties = [
  "Cardiology",
  "Dermatology",
  "Emergency Medicine",
  "Family Medicine",
  "Internal Medicine",
  "Neurology",
  "Obstetrics and Gynecology",
  "Ophthalmology",
  "Orthopedic Surgery",
  "Pediatrics",
  "Psychiatry",
  "Radiology",
  "Surgery",
  "Urology",
  "Anesthesiology",
  "Pathology",
  "Physical Medicine",
  "Plastic Surgery",
  "Wound Care",
  "Podiatry",
];

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

function generateEmail(
  firstName: string,
  lastName: string,
  domain: string,
): string {
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;
}

function generatePhone(): string {
  const areaCode = Math.floor(Math.random() * 900) + 100;
  const prefix = Math.floor(Math.random() * 900) + 100;
  const lineNumber = Math.floor(Math.random() * 9000) + 1000;
  return `+1-${areaCode}-${prefix}-${lineNumber}`;
}

async function main() {
  console.log("Starting database seed...");

  // Create super user
  const hashedPassword = await bcrypt.hash("SuperPassword123", 10);

  const superUser = await prisma.user.upsert({
    where: { email: "super@woundtech.com" },
    update: {},
    create: {
      email: "super@woundtech.com",
      password: hashedPassword,
      role: UserRole.SUPER,
    },
  });

  console.log("\nSuper user created:");
  console.log("   Email: super@woundtech.com");
  console.log("   Password: SuperPassword123");
  console.log("   Role: SUPER");
  console.log(`   ID: ${superUser.id}`);

  // Create 100 Clinicians with Users
  console.log("\nCreating 100 clinicians with user accounts...");
  const clinicians = [];
  const defaultPassword = await bcrypt.hash("Password123", 10);

  for (let i = 0; i < 100; i++) {
    const firstName = randomElement(firstNames);
    const lastName = randomElement(lastNames);
    const email = generateEmail(firstName, lastName, "hospital.com");
    const specialty = randomElement(specialties);

    // Create user first
    const user = await prisma.user.create({
      data: {
        email: `${email}.${i}`,
        password: defaultPassword,
        role: UserRole.CLINICIAN,
      },
    });

    // Create clinician linked to user
    const clinician = await prisma.clinician.create({
      data: {
        userId: user.id,
        firstName,
        lastName,
        specialty,
      },
    });
    clinicians.push(clinician);

    if ((i + 1) % 20 === 0) {
      console.log(`   Created ${i + 1} clinicians...`);
    }
  }
  console.log(`Created ${clinicians.length} clinicians`);

  // Create 100 Patients
  console.log("\nCreating 100 patients...");
  const patients = [];
  const startDate = new Date(1940, 0, 1);
  const endDate = new Date(2010, 11, 31);

  for (let i = 0; i < 100; i++) {
    const firstName = randomElement(firstNames);
    const lastName = randomElement(lastNames);
    const dateOfBirth = randomDate(startDate, endDate);
    const phone = generatePhone();

    const patient = await prisma.patient.create({
      data: {
        firstName,
        lastName,
        dateOfBirth,
        phone,
      },
    });
    patients.push(patient);

    if ((i + 1) % 20 === 0) {
      console.log(`   Created ${i + 1} patients...`);
    }
  }
  console.log(`Created ${patients.length} patients`);

  console.log("\n========================");
  console.log("Seed Summary:");
  console.log(`   Total Clinicians: ${clinicians.length}`);
  console.log(`   Total Patients: ${patients.length}`);
  console.log(`   Super User: 1`);
  console.log("========================");
  console.log("\nSeed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

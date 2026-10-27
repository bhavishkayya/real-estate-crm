import { PrismaClient, Role } from '@prisma/client';
const prisma = new PrismaClient();
async function main(){
  const admin=await prisma.user.upsert({where:{email:'admin@crm.local'},update:{},create:{name:'Super Admin',email:'admin@crm.local',passwordHash:'CHANGE_ME',role:Role.SUPER_ADMIN}});
  const projects=[['Mahalunge Heights','Mahalunge, Pune',''],['Hinjewadi Greens','Hinjewadi, Pune',''],['Wakad Central','Wakad, Pune','']];
  for(const [name,location,developer] of projects) await prisma.project.upsert({where:{id:`seed-${name.toLowerCase().replace(/[^a-z]+/g,'-')}`},update:{},create:{id:`seed-${name.toLowerCase().replace(/[^a-z]+/g,'-')}`,name,location,developer:developer||null}});
  console.log('Seed complete:',admin.email);
}
main().finally(()=>prisma.$disconnect());

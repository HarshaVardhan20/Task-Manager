const prisma = require('./prisma');

async function checkData() {
    const users = await prisma.task.findMany();
    console.log(users);
}

checkData();
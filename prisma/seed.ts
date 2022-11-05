import { PrismaClient } from '@prisma/client';

const client = new PrismaClient();

async function seed() {
  const author = await client.author.upsert({
    where: { email: 'leo.lemos.ds@icloud.com' },
    update: {},
    create: {
      email: 'leo.lemos.ds@icloud.com',
      name: 'Leonardo Lemos',
      createdAt: new Date(),
      updatedAt: new Date(),
      photoURL: 'https://github.com/mrlemoos.png',
    },
  });

  const postIds = ['b698c603-c13e-490c-ba96-1e1400059b8a', 'c1557636-b6fc-4ac3-87a7-9064ea21ef6b'];

  await client.post.upsert({
    where: { id: postIds[0] },
    update: {},
    create: {
      id: postIds[0],
      title: 'Hello World',
      content: `
        This is my first post! It is important to have a summary at the beginning of the post hence the front-end
        will be able to display a summary of the post in the blog's homepage. That's the tip!

        Hope you like it! :smile:

        ## Next Steps

        - [ ] Add comments
        - [ ] Add likes
        
      `,
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: author.id,
      tags: 'React, TypeScript, NextJS',
      published: true,
    },
  });

  await client.post.upsert({
    where: { id: postIds[1] },
    update: {},
    create: {
      id: postIds[1],
      title: 'How Mongo is Awesome 🎉',
      content:
        'This is just a template where I use to store a sentence about how mongo is good inside of a Postgres database. My heart is divided right now ;-;',
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: author.id,
      tags: 'MongoDB, Postgres, Prisma, ORM',
      published: true,
    },
  });
}

async function main() {
  try {
    await seed();
    await client.$disconnect();
  } catch (error_) {
    console.error(error_);
    await client.$disconnect();
    process.exit(1);
  }
}

main();

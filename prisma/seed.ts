import { PrismaClient } from '@prisma/client';

const client = new PrismaClient();

async function drop() {
  try {
    await client.post.deleteMany();
    await client.author.deleteMany();
    await client.$disconnect();
  } catch (error_) {
    console.error(error_);
    await client.$disconnect();
    process.exit(1);
  }
}

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
      title: 'Hello World 🌎',
      content: `A paragraph with *emphasis* and **strong importance**.

> A block quote with ~strikethrough~ and a URL: https://reactjs.org.

* Lists
* [ ] todo
* [x] done

A table:

| a | b |
| - | - |
`,
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: author.id,
      bannerPhotoURL:
        'https://images.unsplash.com/photo-1504639725590-34d0984388bd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2148&q=80',
      bannerPhotoCredits: 'Kevin Ku; Unsplash',
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
    await drop();
    await seed();
    await client.$disconnect();
  } catch (error_) {
    console.error(error_);
    await client.$disconnect();
    process.exit(1);
  }
}

main();

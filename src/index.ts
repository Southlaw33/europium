import { serve } from "@hono/node-server";
import { PrismaClient } from "@prisma/client";

import { Hono } from "hono";

const app = new Hono();
const prismaClient = new PrismaClient();

//to get all contacts
app.get("/contacts", async (c) => {
  try {
    const contacts = await prismaClient.contact.findMany();
    return c.json(contacts, 200);
  } catch (e) {
    console.log(e);
  }
});

//to insert a contact
app.post("/contacts", async (c) => {
  const { name, phoneNumber, email } = await c.req.json();
  try {
    const contact = await prismaClient.contact.create({
      data: {
        name,
        phoneNumber,
        email,
      },
    });
    return c.json(contact, 201);
  } catch (e) {
    console.log(e);
  }
});

//to patch a contact
app.patch("/contacts/:id", async (c) => {
  const { id } =  c.req.param();
  const { name, phoneNumber, email } = await c.req.json();
  try {
    const contact = await prismaClient.contact.update({
      where: {
        id,
      },
      data: {
        name,
        phoneNumber,
        email,
      },
    });
    return c.json(contact, 200);
  } catch (e) {
    console.log(e);
  }
});

app.delete("/contacts/:id", async (c) => {
  const { id } = await c.req.param();
  try {
    await prismaClient.contact.delete({
      where: {
        id,
      },
    });
    return c.json({ message: "contact deleted" }, 200);
  } catch (e) {
    console.log(e);
  }
});

serve(app);
console.log("Server ON!");

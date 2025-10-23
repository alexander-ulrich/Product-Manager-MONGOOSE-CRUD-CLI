import "#db";
import { Product } from "#models";
import type { ProductType } from "#types";
import { BSON } from "bson";
import { Command } from "commander";

const program = new Command();
program
  .name("ecommerce-cli")
  .description(
    "Simple product CRUD CLI - use 'npm start <command> <arguments> to interact with the product list'"
  )
  .version("1.0.0");

// ADD
program
  .command("add")
  .description("Add a new product")
  .argument("<name>", "Product name")
  .argument("<stock>", "Stock quantity")
  .argument("<price>", "Product price")
  .argument("<tags>", "<tag1,tag2,...")
  .action(
    async (name: string, stockStr: string, priceStr: string, tags: string) => {
      try {
        const stock = Number(stockStr);
        const price = Number(priceStr);
        const doc = {
          name: name,
          stock: stock,
          price: price,
          tags: tags.split(","),
        };
        const newProduct = await Product.create<ProductType>(doc);

        console.log(
          "CLI application was called with add command with arguments:",
          {
            name,
            stockStr,
            priceStr,
            tags,
          },
          "the new product: " + newProduct + " was added successfully!"
        );
      } catch (error) {
        if (error instanceof Error) console.log("ERROR:" + error.message);
      } finally {
        process.exit(0);
      }
    }
  );

// LIST
program
  .command("list")
  .description("List all products")
  .action(async () => {
    try {
      const products = await Product.find();
      console.log("CLI application was called with list command");
      console.log(products);
    } catch (error) {
      if (error instanceof Error) console.log("ERROR:" + error.message);
    } finally {
      process.exit(0);
    }
  });

// GET
program
  .command("get")
  .description("Get product by ID")
  .argument("<id>", "Product ID")
  .action(async (id: string) => {
    try {
      const productByID = await Product.findById(id);
      console.log("CLI application was called with get command");
      console.log(productByID);
    } catch (error) {
      if (error instanceof Error) console.log("ERROR:" + error.message);
    } finally {
      process.exit(0);
    }
  });

// SEARCH
program
  .command("search")
  .description("Get products by tag")
  .argument("<tag>", "Product tag")
  .action(async (tag: string) => {
    try {
      const productsByTag = await Product.find({
        tags: { $in: tag.split(",") },
      });
      console.log("CLI application was called with search command");
      if (productsByTag.length < 1) {
        console.log("No results for Tag(s): " + tag);
      } else {
        console.log(productsByTag);
      }
    } catch (error) {
      if (error instanceof Error) console.log("ERROR:" + error.message);
    } finally {
      process.exit(0);
    }
  });

// UPDATE
program
  .command("update")
  .description("Update product by ID")
  .argument("<id>", "Product ID")
  .argument("<name>", "Product name")
  .argument("<stock>", "Stock quantity")
  .argument("<price>", "Product price")
  .argument("<tags>", "<tag1,tag2,...")
  .action(
    async (
      idStr: string,
      name: string,
      stockStr: string,
      priceStr: string,
      tags: string
    ) => {
      try {
        const id = new BSON.ObjectId(idStr);
        const stock = Number(stockStr);
        const price = Number(priceStr);

        const doc = {
          name: name,
          stock: stock,
          price: price,
          tags: tags.split(","),
        };

        await Product.findOneAndUpdate({ _id: id }, doc);

        console.log(
          "CLI application was called with update command with arguments:",
          {
            name,
            stock,
            price,
            tags,
          },
          ",",
          "the product was successfully updated!"
        );
      } catch (error) {
        if (error instanceof Error) console.log("ERROR:" + error.message);
      } finally {
        process.exit(0);
      }
    }
  );

// DELETE
program
  .command("delete")
  .description("Delete product by ID")
  .argument("<id>", "Product ID")
  .action(async (idStr: string) => {
    try {
      const id = new BSON.ObjectId(idStr);

      const result = await Product.deleteOne({ _id: id });

      console.log("CLI application was called with delete command:");
      if (result.acknowledged) {
        console.log("the product was successfully deleted!");
      } else {
        console.log("the product could not be deleted!");
      }
    } catch (error) {
      if (error instanceof Error) console.log("ERROR:" + error.message);
    } finally {
      process.exit(0);
    }
  });

program.hook("postAction", () => process.exit(0));
program.parse();

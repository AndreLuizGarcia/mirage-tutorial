import { belongsTo, createServer, hasMany, Model, RestSerializer, Factory, trait } from 'miragejs'

export default function () {
  createServer({
    serializers: {
      reminder: RestSerializer.extend({
        include: ["list"],
        embed: true,
      }),
    },

    factories: {
      list: Factory.extend({
        name(i) {
          return `List ${i}`;
        },

        withReminders: trait({
          afterCreate(list, server) {
            server.createList('reminder', 5, { list })
          }
        })
      }),

      reminder: Factory.extend({
        text(i) {
          return `Reminder ${i}`
        }
      }),
    },

    models: {
      list: Model.extend({
        reminders: hasMany(),
      }),

      reminder: Model.extend({
        list: belongsTo(),
      }),
    },

    seeds(server) {
      // server.create("reminder", { text: "Walk the dog" })
      // server.create("reminder", { text: "Take out the trash" })
      // server.create("reminder", { text: "Work out" })

      // let homeList = server.create("list", { name: "Home" });
      // server.create("reminder", { list: homeList, text: "Do taxes" })

      // let workList = server.create("list", { name: "Work" });
      // server.create("reminder", { list: workList, text: "Visit bank" })

      // server.create("reminder");
      // server.create("reminder");
      // server.create("reminder");

      // // Create a specific reminder
      // server.create('reminder', { text: 'Walk the dog' })

      // server.createList("reminder", 100);

      // server.create("list", {
      //   reminders: server.createList("reminder", 5),
      // });

      // server.create("list", {
      //   name: "Home",
      //   reminders: [server.create("reminder", { text: "Do taxes" })],
      // });
    
      // server.create("list")

      // server.create("list", "withReminders")

      server.create("reminder", { text: "Walk the dog" });
      server.create("reminder", { text: "Take out the trash" });
      server.create("reminder", { text: "Work out" });
    
      server.create("list", {
        name: "Home",
        reminders: [server.create("reminder", { text: "Do taxes" })],
      });
    
      server.create("list", {
        name: "Work",
        reminders: [server.create("reminder", { text: "Visit bank" })],
      });
    },

    routes() {
      this.get("api/reminders", (schema) => {
        return schema.reminders.all()
      })

      this.post("/api/reminders", (schema, request) => {
        let attrs = JSON.parse(request.requestBody)

        return schema.reminders.create(attrs)
      })

      this.delete("/api/reminders/:id", (schema, request) => {
        let id = request.params.id
      
        return schema.reminders.find(id).destroy()
      })

      this.get("/api/lists/:id/reminders", (schema, request) => {
        let listId = request.params.id
        let list = schema.lists.find(listId)
      
        return list.reminders
      })
    }
  })
}
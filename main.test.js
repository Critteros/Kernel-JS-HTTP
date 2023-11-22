const { faker } = require("@faker-js/faker");

const BASE_URL = "http://127.0.0.1:9000";

describe("Test Server API", () => {
  describe("GET /users", () => {
    const request = new Request(`${BASE_URL}/users`, { method: "GET" });

    it("should return a 200 status code", async () => {
      const response = await fetch(request);
      expect(response.status).toBe(200);
    });

    it("returns an array with at least two users", async () => {
      const response = await fetch(request);
      const users = await response.json();
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThanOrEqual(2);
    });

    it("each user has unique id", async () => {
      const response = await fetch(request);
      const users = await response.json();
      const ids = users.map((user) => user.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("each user has name and email", async () => {
      const response = await fetch(request);
      const users = await response.json();
      users.forEach((user) => {
        expect(user.name).toBeDefined();
        expect(user.email).toBeDefined();
      });
    });
  });

  describe("GET /users/:id", () => {
    const id = 1;
    const request = new Request(`${BASE_URL}/users/${id}`, { method: "GET" });

    it("should return a 200 status code", async () => {
      const response = await fetch(request);
      expect(response.status).toBe(200);
    });

    it("returns a user with id", async () => {
      const response = await fetch(request);
      const user = await response.json();
      expect(user.id).toBe(id);
    });

    it("returns a user with name and email", async () => {
      const response = await fetch(request);
      const user = await response.json();
      expect(user.name).toBeDefined();
      expect(user.email).toBeDefined();
    });
  });

  describe("POST /users", () => {
    const postWithData = async (data) => {
      return await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    };

    it("should return a 201 status code", async () => {
      const response = await postWithData({
        name: faker.internet.displayName(),
        email: faker.internet.email(),
      });
      expect(response.status).toBe(201);
    });

    it("returns a user with id", async () => {
      const response = await postWithData({
        name: faker.internet.displayName(),
        email: faker.internet.email(),
      });
      const user = await response.json();
      expect(user.id).toBeDefined();
      expect(user.id).not.toBeNull();
    });

    it("returns the same user with name and email", async () => {
      const name = faker.internet.displayName();
      const email = faker.internet.email();
      const response = await postWithData({ name, email });
      const user = await response.json();
      expect(user.name).toBe(name);
      expect(user.email).toBe(email);
    });

    it("queries user with id after creation", async () => {
      const email = faker.internet.email();
      const name = faker.internet.displayName();
      const respose = await postWithData({
        name,
        email,
      });
      const { id } = await respose.json();
      const getResponse = await fetch(`${BASE_URL}/users/${id}`, {
        method: "GET",
      });

      expect(getResponse.status).toBe(200);
      const user = await getResponse.json();
      expect(user).toMatchObject({ id, name, email });
    });
  });

  describe("PUT /users/:id", () => {
    let putData;

    beforeEach(() => {
      putData = {
        name: faker.internet.displayName(),
        email: faker.internet.email(),
      };
    });

    it("returns 404 if user not found", async () => {
      const id = faker.number.int({ min: 999 });
      const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(putData),
      });
      expect(response.status).toBe(404);
    });

    describe("with previusly created user", () => {
      let user, request;

      beforeEach(async () => {
        const data = {
          name: faker.internet.displayName(),
          email: faker.internet.email(),
        };
        const response = await fetch(`${BASE_URL}/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        user = await response.json();

        request = new Request(`${BASE_URL}/users/${user.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(putData),
        });
      });

      it("should return a 200 status code", async () => {
        const response = await fetch(request);

        expect(response.status).toBe(200);
      });

      it("does not allow changing id field", async () => {
        const response = await fetch(request, {
          body: JSON.stringify({
            ...putData,
            id: faker.number.int({ min: 999 }),
          }),
        });

        expect(response.status).toBe(406);
      });

      it("returns back id in object", async () => {
        const response = await fetch(request);
        expect(response.status).toBe(200);

        const updatedUser = await response.json();

        expect(updatedUser.id).toBe(user.id);
      });

      it("returns updated user", async () => {
        const response = await fetch(request);

        expect(response.status).toBe(200);
        const updatedUser = await response.json();

        expect(updatedUser).toMatchObject({ ...user, ...putData });
      });
    });
  });

  describe("PATCH /users/:id", () => {
    let patchData;

    beforeEach(() => {
      patchData = {
        name: faker.internet.displayName(),
        email: faker.internet.email(),
      };
    });

    it("returns 404 if user not found", async () => {
      const id = faker.number.int({ min: 999 });
      const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patchData),
      });
      expect(response.status).toBe(404);
    });

    describe("with previusly created user", () => {
      let user, request;

      beforeEach(async () => {
        const data = {
          name: faker.internet.displayName(),
          email: faker.internet.email(),
        };
        const response = await fetch(`${BASE_URL}/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        user = await response.json();

        request = new Request(`${BASE_URL}/users/${user.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patchData),
        });
      });

      it("should return a 200 status code", async () => {
        const response = await fetch(request);

        expect(response.status).toBe(200);
      });

      it("returns back id in object", async () => {
        const response = await fetch(request);
        const updatedUser = await response.json();
        expect(updatedUser.id).toBe(user.id);
      });

      it("returns updated user", async () => {
        const response = await fetch(request);
        const updatedUser = await response.json();
        expect(updatedUser).toMatchObject({ ...user, ...patchData });
      });

      it("does not allow changing id field", async () => {
        const response = await fetch(request, {
          body: JSON.stringify({
            ...patchData,
            id: faker.number.int({ min: 999 }),
          }),
        });

        expect(response.status).toBe(406);
      });
    });
  });

  describe("DELETE /users/:id", () => {
    it("returns 404 if user not found", async () => {
      const id = faker.number.int({ min: 999 });
      const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: "DELETE",
      });
      expect(response.status).toBe(404);
    });

    describe("with previusly created user", () => {
      let user;

      beforeEach(async () => {
        const data = {
          name: faker.internet.displayName(),
          email: faker.internet.email(),
        };
        const response = await fetch(`${BASE_URL}/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        user = await response.json();
      });

      it("should return a 200 status code", async () => {
        const response = await fetch(`${BASE_URL}/users/${user.id}`, {
          method: "DELETE",
        });

        expect(response.status).toBe(200);
      });

      it("returns deleted user", async () => {
        const response = await fetch(`${BASE_URL}/users/${user.id}`, {
          method: "DELETE",
        });
        const deletedUser = await response.json();
        expect(deletedUser).toMatchObject(user);
      });
    });
  });
});

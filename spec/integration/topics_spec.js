const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/topics/";

const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const User = require("../../src/db/models").User;

describe("routes : topics", () => {

    beforeEach((done) => {
        this.topic;

        sequelize.sync({
            force: true
        }).then((res) => {

            Topic.create({
                    title: "Sample Topic Title, topics_spec",
                    description: "Sample topic description, topics_spec"
                })
                .then((topic) => {
                    this.topic = topic;
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
        });
    });
    describe("admin user performing CRUD actions for Topic", () => {

        beforeEach((done) => {
            User.create({
                    email: "admin@email.com",
                    password: "adminPassword",
                    role: "admin"
                })
                .then((user) => {
                    request.get({
                            url: "http://localhost:3000/auth/fake",
                            form: {
                                role: user.role,
                                userId: user.id,
                                email: user.email
                            }
                        },
                        (err, res, body) => {
                            done();
                        }
                    );
                });
        });

        describe("GET /topics", () => {
            it("should return a status code 200 and all topics", (done) => {
                request.get(base, (err, res, body) => {
                    expect(res.statusCode).toBe(200);
                    expect(err).toBeNull();
                    expect(body).toContain("Topics");
                    expect(body).toContain("Sample Topic Title, topics_spec");
                    done();
                });
            });
        });
        describe("GET /topics/new", () => {
            it("should render a new topic form", (done) => {
                request.get(`${base}new`, (err, res, body) => {
                    expect(err).toBeNull();
                    expect(body).toContain("New Topic");
                    done();
                });
            });
        });
        describe("POST /topics/create", () => {
            const options = {
                url: `${base}create`,
                form: {
                    title: "Sample Post title, topic_spec/create",
                    description: "Sample Post description, topics_spec/create"
                }
            };
            it("should create a new topic and redirect", (done) => {
                request.post(options, (err, res, body) => {
                    Topic.findOne({
                            where: {
                                title: "Sample Post title, topic_spec/create"
                            }
                        })
                        .then((topic) => {
                            expect(res.statusCode).toBe(303);
                            expect(topic.title).toBe("Sample Post title, topic_spec/create");
                            expect(topic.description).toBe("Sample Post description, topics_spec/create");
                            done();
                        })
                        .catch((err) => {
                            console.log(err);
                            done();
                        });
                });
            });
        });
        describe("GET /topics/:id", () => {
            it("should render a view with the selected topic", (done) => {
                request.get(`${base}${this.topic.id}`, (err, res, body) => {
                    expect(err).toBeNull();
                    expect(body).toContain("Sample Topic Title, topics_spec");
                    done();
                });
            });
        });
        describe("POST /topics/:id/destroy", () => {
            it("should delete the topic with the associated ID", (done) => {
                Topic.all()
                    .then((topics) => {
                        const topicCountBeforeDelete = topics.length;
                        expect(topicCountBeforeDelete).toBe(1);
                        request.post(`${base}${this.topic.id}/destroy`, (err, res, body) => {
                            Topic.all()
                                .then((topics) => {
                                    expect(err).toBeNull();
                                    expect(topics.length).toBe(topicCountBeforeDelete - 1);
                                    done();
                                });
                        });
                    });
            });
        });
        describe("GET /topics/:id/edit", () => {
            it("should render a view with an edit topic form", (done) => {
                request.get(`${base}${this.topic.id}/edit`, (err, res, body) => {
                    expect(err).toBeNull();
                    expect(body).toContain("Edit Topic");
                    expect(body).toContain("Sample Topic Title, topics_spec");
                    done();
                });
            });
        });
        describe("POST /topics/:id/update", () => {
            it("should update the topic with the given values", (done) => {
                const options = {
                    url: `${base}${this.topic.id}/update`,
                    form: {
                        title: "Sample post title, topics_spec/update",
                        description: "Sample post description, topics_spec/update"
                    }
                };
                request.post(options, (err, res, body) => {
                    expect(err).toBeNull();
                    Topic.findOne({
                            where: {
                                id: this.topic.id
                            }
                        })
                        .then((topic) => {
                            expect(topic.title).toBe("Sample post title, topics_spec/update");
                            done();
                        });
                });
            });
        });
    });
    describe("member user performing CRUD actions for Topic", () => {

        beforeEach((done) => {
            request.get({
                    url: "http://localhost:3000/auth/fake",
                    form: {
                        role: "member"
                    }
                },
                (err, res, body) => {
                    done();
                }
            );
        });

        describe("GET /topics", () => {
            it("should return a status code 200 and all topics", (done) => {
                request.get(base, (err, res, body) => {
                    expect(res.statusCode).toBe(200);
                    expect(err).toBeNull();
                    expect(body).toContain("Topics");
                    expect(body).toContain("Sample Topic Title, topics_spec");
                    done();
                });
            });
        });
        describe("GET /topics/new", () => {
            it("should render a new topic form, but redirect to topics view", (done) => {
                request.get(`${base}new`, (err, res, body) => {
                    expect(err).toBeNull();
                    expect(body).toContain("Topics");
                    done();
                });
            });
        });
        describe("POST /topics/create", () => {
            const options = {
                url: `${base}create`,
                form: {
                    title: "Sample Post title, topic_spec/create",
                    description: "Sample Post description, topics_spec/create"
                }
            };
            it("should create a new topic", (done) => {
                request.post(options, (err, res, body) => {
                    Topic.findOne({
                            where: {
                                title: "Sample Post title, topic_spec/create"
                            }
                        })
                        .then((topic) => {
                            expect(topic).not.toBeNull();
                            expect(topic.title).toBe("Sample Post title, topic_spec/create");
                            done();
                        })
                        .catch((err) => {
                            console.log(err);
                            done();
                        });
                });
            });
        });
        describe("GET /topics/:id", () => {
            it("should render a view with the selected topic", (done) => {
                request.get(`${base}${this.topic.id}`, (err, res, body) => {
                    expect(err).toBeNull();
                    expect(body).toContain("Sample Topic Title, topics_spec");
                    done();
                });
            });
        });
        describe("POST /topics/:id/destroy", () => {
            it("should NOT delete the topic with the associated ID", (done) => {
                Topic.all()
                    .then((topics) => {
                        const topicCountBeforeDelete = topics.length;
                        expect(topicCountBeforeDelete).toBe(1);
                        request.post(`${base}${this.topic.id}/destroy`, (err, res, body) => {
                            Topic.all()
                                .then((topics) => {
                                    expect(topics.length).toBe(topicCountBeforeDelete);
                                    done();
                                });
                        });
                    });
            });
        });
        describe("GET /topics/:id/edit", () => {
            it("should NOT render a view with an edit topic form", (done) => {
                request.get(`${base}${this.topic.id}/edit`, (err, res, body) => {
                    expect(err).toBeNull();
                    expect(body).not.toContain("Edit Topic");
                    expect(body).toContain("Sample Topic Title, topics_spec");
                    done();
                });
            });
        });
        describe("POST /topics/:id/update", () => {
            it("should NOT update the topic with the given values", (done) => {
                const options = {
                    url: `${base}${this.topic.id}/update`,
                    form: {
                        title: "Sample post title, topics_spec/update",
                        description: "Sample post description, topics_spec/update"
                    }
                };
                request.post(options, (err, res, body) => {
                    expect(err).toBeNull();
                    Topic.findOne({
                            where: {
                                id: this.topic.id
                            }
                        })
                        .then((topic) => {
                            expect(topic.title).toBe("Sample Topic Title, topics_spec");
                            done();
                        });
                });
            });
        });
    });
});
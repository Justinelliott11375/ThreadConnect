const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/topics";

const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;

describe("routes : posts", () => {

    beforeEach((done) => {
        this.topic;
        this.post;

        sequelize.sync({
            force: true
        }).then((res) => {
            Topic.create({
                    title: "Topic Title For Post Route Test",
                    description: "Topic description for post route test"
                })
                .then((topic) => {
                    this.topic = topic;

                    Post.create({
                            title: "Post title for post route test",
                            body: "Post description for post route test",
                            topicId: this.topic.id
                        })
                        .then((post) => {
                            this.post = post;
                            done();
                        })
                        .catch((err) => {
                            console.log(err);
                            done();
                        });
                });
        });

    });

    describe("GET /topics/:topicId/posts/new", () => {

        it("should render a new post form", (done) => {
            request.get(`${base}/${this.topic.id}/posts/new`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("New Post");
                done();
            });
        });

    });

    describe("POST /topics/:topicId/posts/create", () => {

        it("should create a new post and redirect", (done) => {
            const options = {
                url: `${base}/${this.topic.id}/posts/create`,
                form: {
                    title: "Post title for create new post test",
                    body: "Post description for create new post test"
                }
            };
            request.post(options,
                (err, res, body) => {

                    Post.findOne({
                            where: {
                                title: "Post title for create new post test"
                            }
                        })
                        .then((post) => {
                            expect(post).not.toBeNull();
                            expect(post.title).toBe("Post title for create new post test");
                            expect(post.body).toBe("Post description for create new post test");
                            expect(post.topicId).not.toBeNull();
                            done();
                        })
                        .catch((err) => {
                            console.log(err);
                            done();
                        });
                }
            );
        });

        it("should not create a new post that fails validations", (done) => {
            const options = {
                url: `${base}/${this.topic.id}/posts/create`,
                form: {
                    title: "x",
                    body: "z"
                }
            };
            request.post(options,
                (err, res, body) => {
                    Post.findOne({
                            where: {
                                title: "x"
                            }
                        })
                        .then((post) => {
                            expect(post).toBeNull();
                            done();
                        })
                        .catch((err) => {
                            console.log(err);
                            done();
                        });
                }
            );
        });

    });
    describe("GET /topics/:topicId/posts/:id", () => {

        it("should render a view with the selected post", (done) => {
            request.get(`${base}/${this.topic.id}/posts/${this.post.id}`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Post title for post route test");
                done();
            });
        });

    });

    describe("POST /topics/:topicId/posts/:id/destroy", () => {

        it("should delete the post with the associated ID", (done) => {
            expect(this.post.id).toBe(1);
            request.post(`${base}/${this.topic.id}/posts/${this.post.id}/destroy`, (err, res, body) => {
                Post.findById(1)
                    .then((post) => {
                        expect(err).toBeNull();
                        expect(post).toBeNull();
                        done();
                    })
            });

        });

    });

    describe("GET /topics/:topicId/posts/:id/edit", () => {

        it("should render a view with an edit post form", (done) => {
            request.get(`${base}/${this.topic.id}/posts/${this.post.id}/edit`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Edit Post");
                expect(body).toContain("Post title for post route test");
                done();
            });
        });

    });

    describe("POST /topics/:topicId/posts/:id/update", () => {

        it("should return a status code 302", (done) => {
            request.post({
                url: `${base}/${this.topic.id}/posts/${this.post.id}/update`,
                form: {
                    title: "Post title for post update test",
                    body: "Post description for post update test."
                }
            }, (err, res, body) => {
                expect(res.statusCode).toBe(302);
                done();
            });
        });

        it("should update the post with the given values", (done) => {
            const options = {
                url: `${base}/${this.topic.id}/posts/${this.post.id}/update`,
                form: {
                    title: "Post title for post update test",
                    body: "Post descrtiption for post update test"
                }
            };
            request.post(options,
                (err, res, body) => {

                    expect(err).toBeNull();

                    Post.findOne({
                            where: {
                                id: this.post.id
                            }
                        })
                        .then((post) => {
                            expect(post.title).toBe("Post title for post update test");
                            done();
                        });
                });
        });

    });
});
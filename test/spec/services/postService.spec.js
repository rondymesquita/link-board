
describe("PostServiceTest", function() {
	var postService,
		$httpBackend,
		$rootScope;

	beforeEach(function(){
		module('PhoenixJS');
	});

	beforeEach(inject(function(_PostService_, _$httpBackend_, _$rootScope_){
		// The injector unwraps the underscores (_) from around the parameter names when matching
		postService = _PostService_;
		$httpBackend = _$httpBackend_;
		$rootScope = _$rootScope_;

		$httpBackend
			.expectGET('content/posts/posts.json')
			.respond(posts);

		$httpBackend
			.expectGET(/themes/)
			.respond();

	}));

	afterEach(function(){
		// $httpBackend.verifyNoOutstandingExpectation();
		// $httpBackend.verifyNoOutstandingRequest();
	});

    it("Should list all posts", function(done) {

		postService.list().then(function(result){
	        expect(posts).toEqual(result);
			done();
	    });

		$httpBackend.flush();

    });

	it("Should list posts by given category", function(done) {

		var expectedPostsFromCategory = [{
	        "id": "3",
	        "title": "The Clone Wars",
	        "slug":"the-clone-wars",
			"url": "#/post/3/the-clone-wars",
	        "excerpt": "Don't be too proud of this technological terror you've constructed. The ability to destroy a planet is insignificant next to the power of the Force. All right. Well, take care of yourself, Han. I guess that's what you're best at, ain't it? Oh God, my uncle. How am I ever gonna explain this? Dantooine. They're on Dantooine. I call it luck.",
	        "image":"content/posts/images/starwars_the_clone_wars.jpg",
	        "categories": [
	            "star-wars", "the-clone-wars","animation"
	        ],
	        "tags":[
	            "turpis","basvitaeic"
	        ],
	        "author":"Rondy Mesquita",
	        "date":"January 28, 2015",
	        "type":"html"
	    }];

		postService.listByCategory('animation').then(function(posts){
	        expect(expectedPostsFromCategory).toEqual(posts);
			done();
	    });

		$httpBackend.flush();

    });

	it("Should list posts by given category (2)", function(done) {

		var expectedPostsFromCategory = [{
	        "id": "1",
	        "title": "The Empire Strikes Back",
	        "slug":"the-empire-strikes-back",
			"url":"#/post/1/the-empire-strikes-back",
	        "excerpt": "Don't be too proud of this technological terror you've constructed. The ability to destroy a planet is insignificant next to the power of the Force. Remember, a Jedi can feel the Force flowing through him. Look, I ain't in this for your revolution, and I'm not in it for you, Princess. I expect to be well paid.",
	        "image":"content/posts/images/starwars_the_empire_strikes_back.jpg",
	        "categories": [
	            "star-wars", "the-empire-strikes-back","movies"
	        ],
	        "tags":[
	            "lorem","ipsum"
	        ],
	        "author":"Rondy Mesquita",
	        "date":"January 28, 2015",
	        "type":"md"
	    },
	    {
	        "id": "2",
	        "title": "A New Hope",
	        "slug":"a-new-hope",
			"url":"#/post/2/a-new-hope",
	        "excerpt": "Look, I ain't in this for your revolution, and I'm not in it for you, Princess. I expect to be well paid. I'm in it for the money. I care. So, what do you think of her, Han? He is here. What?! I find your lack of faith disturbing. You are a part of the Rebel Alliance and a traitor! Take her away!",
	        "image":"content/posts/images/starwars_a_new_hope.jpg",
	        "categories": [
	            "star-wars", "a-new-hope","movies"
	        ],
	        "tags":[
	            "turpis","basvitaeic"
	        ],
	        "author":"Rondy Mesquita",
	        "date":"January 28, 2015",
	        "type":"md"
	    }];

		postService.listByCategory('movies').then(function(posts){
	        expect(expectedPostsFromCategory).toEqual(posts);
			done();
	    });

		$httpBackend.flush();

    });

	it("Should get a post by id", function(done) {
		var expectedPost = {
	        "id": "1",
	        "title": "The Empire Strikes Back",
	        "slug":"the-empire-strikes-back",
			"url":"#/post/1/the-empire-strikes-back",
	        "excerpt": "Don't be too proud of this technological terror you've constructed. The ability to destroy a planet is insignificant next to the power of the Force. Remember, a Jedi can feel the Force flowing through him. Look, I ain't in this for your revolution, and I'm not in it for you, Princess. I expect to be well paid.",
	        "image":"content/posts/images/starwars_the_empire_strikes_back.jpg",
	        "categories": [
	            "star-wars", "the-empire-strikes-back","movies"
	        ],
	        "tags":[
	            "lorem","ipsum"
	        ],
	        "author":"Rondy Mesquita",
	        "date":"January 28, 2015",
	        "type":"md"
	    };

		postService.getById(1).then(function(post){
	        expect(expectedPost).toEqual(post);
			done();
	    });

		$httpBackend.flush();

	});

	it("Should get another post by id", function(done) {
		var expectedPost = {
			"id": "2",
			"title": "A New Hope",
			"slug":"a-new-hope",
			"url":"#/post/2/a-new-hope",
			"excerpt": "Look, I ain't in this for your revolution, and I'm not in it for you, Princess. I expect to be well paid. I'm in it for the money. I care. So, what do you think of her, Han? He is here. What?! I find your lack of faith disturbing. You are a part of the Rebel Alliance and a traitor! Take her away!",
			"image":"content/posts/images/starwars_a_new_hope.jpg",
			"categories": [
				"star-wars", "a-new-hope","movies"
			],
			"tags":[
				"turpis","basvitaeic"
			],
			"author":"Rondy Mesquita",
			"date":"January 28, 2015",
			"type":"md"
		};

		postService.getById(2).then(function(post){
	        expect(expectedPost).toEqual(post);
			done();
	    });

		$httpBackend.flush();

	});

	it("Should get a post by search", function(done) {
		var expectedResultSearch = [
		    {
		        "id": "1",
		        "title": "The Empire Strikes Back",
		        "slug":"the-empire-strikes-back",
				"url":"#/post/1/the-empire-strikes-back",
		        "excerpt": "Don't be too proud of this technological terror you've constructed. The ability to destroy a planet is insignificant next to the power of the Force. Remember, a Jedi can feel the Force flowing through him. Look, I ain't in this for your revolution, and I'm not in it for you, Princess. I expect to be well paid.",
		        "image":"content/posts/images/starwars_the_empire_strikes_back.jpg",
		        "categories": [
		            "star-wars", "the-empire-strikes-back","movies"
		        ],
		        "tags":[
		            "lorem","ipsum"
		        ],
		        "author":"Rondy Mesquita",
		        "date":"January 28, 2015",
		        "type":"md"
		    }
		];

		postService.listBySearch('Empire').then(function(resultSearch){
	        expect(expectedResultSearch).toEqual(resultSearch);
			done();
	    });

		$httpBackend.flush();

	});

	it("Should get a post by search a category", function(done) {
		var expectedResultSearch = [{
	        "id": "1",
	        "title": "The Empire Strikes Back",
	        "slug":"the-empire-strikes-back",
			"url":"#/post/1/the-empire-strikes-back",
	        "excerpt": "Don't be too proud of this technological terror you've constructed. The ability to destroy a planet is insignificant next to the power of the Force. Remember, a Jedi can feel the Force flowing through him. Look, I ain't in this for your revolution, and I'm not in it for you, Princess. I expect to be well paid.",
	        "image":"content/posts/images/starwars_the_empire_strikes_back.jpg",
	        "categories": [
	            "star-wars", "the-empire-strikes-back","movies"
	        ],
	        "tags":[
	            "lorem","ipsum"
	        ],
	        "author":"Rondy Mesquita",
	        "date":"January 28, 2015",
	        "type":"md"
	    },
	    {
	        "id": "2",
	        "title": "A New Hope",
	        "slug":"a-new-hope",
			"url":"#/post/2/a-new-hope",
	        "excerpt": "Look, I ain't in this for your revolution, and I'm not in it for you, Princess. I expect to be well paid. I'm in it for the money. I care. So, what do you think of her, Han? He is here. What?! I find your lack of faith disturbing. You are a part of the Rebel Alliance and a traitor! Take her away!",
	        "image":"content/posts/images/starwars_a_new_hope.jpg",
	        "categories": [
	            "star-wars", "a-new-hope","movies"
	        ],
	        "tags":[
	            "turpis","basvitaeic"
	        ],
	        "author":"Rondy Mesquita",
	        "date":"January 28, 2015",
	        "type":"md"
	    }];

		postService.listBySearch('movies').then(function(resultSearch){
	        expect(expectedResultSearch).toEqual(resultSearch);
			done();
	    });

		$httpBackend.flush();

	});
});

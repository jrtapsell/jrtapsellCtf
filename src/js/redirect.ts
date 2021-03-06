/// <reference path="myTypes.ts" />

class ProgressManager {
  private deregister;
  private selector;
  private active = false;

  constructor(selector: string) {
    this.deregister = undefined;
    this.selector = selector;
  }

  show(): void {
    if (!this.active) {
      this.active = true;
      if (this.deregister) {
        this.deregister();
        this.deregister = null;
      }
      console.time("main progress shown");
      $(this.selector).show();
    }
  }

  hide(on_move?: () => void): void {
    if (this.active) {
      this.active = false;
      this.deregister = on_move;
      console.timeEnd("main progress shown");
      $(this.selector).hide();
    }
  };
}

var main_progress = new ProgressManager("#statusBar");

class Router {
  static redirect_log(color: string, messageContents: string, data?: any) {
    console.colourLog("#00F", color, messageContents, data);
  }

  private render_icons() {
    fb.path("users").once("value", function (data) {
      var users = data.val();
      $(".user-icon").each(function (_, item) {
        var id = item.dataset.id;
        var jq_item = $(item);
        var user_data = users[id];
        jq_item.css("background-image", "url(" + user_data.image + ")");
        jq_item.attr("title", user_data.name);
        $(jq_item).click(function () {
          router.user(id);
          return false;
        });
      });
      $(".username-auto").each(function (_, item) {
        var id = item.dataset.id;
        var jq_item = $(item);
        var user_data = users[id];
        jq_item.text(user_data.name);
      });
    });
  }

  load_error(message: string) {
    $("#page-content").html("<h1>" + message + "</h1>");
    main_progress.hide();
  }

  private redirect(page: string, contents?: any, id?: string|number): void {
    Router.redirect_log("#F00", "Render started", [page, contents]);
    $("#page-content").html(CTF.pages[page](contents));
    Router.redirect_log("#F00", "Render completed ");
    var tail = !!id ? page + "/" + id : page;
    history.pushState(null, "", "https://ctf.jrtapsell.co.uk/" + tail + "/");
    componentHandler.upgradeDom();
  }

  login(): void {
    Router.redirect_log("#0F0", "Login navigation started");
    main_progress.show();
    this.redirect("login");
    var unsubscribe = fb.authUpdate(function (user) {
      if (user) {
        unsubscribe();
        router.index();
      }
    });
    $("#google-login").click(fb.googleLogin);
    $("#github-login").click(fb.githubLogin);
    $("#facebook-login").click(fb.facebookLogin);
    main_progress.hide();
  };

  link(): void {
    Router.redirect_log("#0F0", "Link navigation started");
    main_progress.show();
    this.redirect("link");
    $("#google-link").click(fb.googleLink);
    $("#github-link").click(fb.githubLink);
    $("#facebook-link").click(fb.facebookLink);
    main_progress.hide();
  };

  /**
   * Routes to the index page
   *
   * @return {void}
   */
  index(): void {
    Router.redirect_log("#0F0", "Index navigation started");
    main_progress.show();
    this.redirect("index");
    main_progress.hide();
  };

  users(): void {
    Router.redirect_log("#0F0", "Users navigation started");
    main_progress.show();
    var usersNode = fb.path('users');
    var listener = (snapshot) => {
      var value = snapshot.val();
      if (value) {
        var users = Object.values(value);
        this.redirect("users", {"users": users});
        $(".card-title").each(function (_, item) {
          var current = $(item);
          current.css("background", "url(" + current.attr("data-background") + ") center / cover");
        });
      } else {
        $("#page-content").html("<h2>No users</h2>");
      }
      $(".user-card").each((_, item) => {
        var id = item.dataset.id;
        var jq_item = $(item);
        jq_item.click(() => {
          this.user(id);
        });
      });
      main_progress.hide(function () {
        usersNode.off("value", listener);
      });
    };
    usersNode.on('value', listener);
  };

  user(user_id: string): void {
    Router.redirect_log("#0F0", "User navigation started");
    main_progress.show();
    var usersNode = fb.path('users', user_id);
    var listener = (snapshot) => {
      var value = snapshot.val();
      if (value) {
        this.redirect("user", value, user_id);
      } else {
        $("#page-content").html("<h2>No such user</h2>");
      }
      main_progress.hide(() => {
        usersNode.off("value", listener);
      });
    };
    usersNode.on('value', listener);
  };

  challenges(): void {
    Router.redirect_log("#0F0", "Challenges navigation started");
    main_progress.show();

    var renderUI = () => {
      if (all_defined(challengesData, usersData)) {
        var temp = {};
        $.each(challengesData, function (key, value) {
          temp[key] = value;
          if (usersData) {
            temp[key].users = usersData[key];
          }
        });
        this.redirect("challenges", {"challenges": temp});
        $(".challenge-row").click(function (event) {
          router.challenge(event.currentTarget.dataset.id);
        });
        this.render_icons();
        var dialogue = <Dialogue> $("#dialog")[0];
        $(".bottom-right-add").click(() => {
          dialogue.showModal();
        });
        $("#upload_upload").click(() => {
          var newNode = challengesNode.push();
          newNode.set({
            description: $("#challenge-description").val(),
            name: $("#challenge-name").val(),
            status: "unstarted",
            type: $("#challenge-type").val(),
            uid: newNode.key
          });
          dialogue.close();
        });
        $("#upload_close").click(function () {
          dialogue.close();
        });
      }

      main_progress.hide(function () {
        challengesNode.off("value", challengesListener);
        usersNode.off("value", usersListener);
      });
    };

    var challengesData;
    var usersData;

    var challengesNode = fb.path('challenges');
    var challengesListener = function (snapshot) {
      challengesData = snapshot.val();
      renderUI();
    };

    var usersNode = fb.path("memberships");
    var usersListener = function (snapshot) {
      usersData = snapshot.val();
      renderUI();
    };

    challengesNode.on('value', challengesListener);
    usersNode.on('value', usersListener);
  };


  logout(): void {
    Router.redirect_log("#0F0", "Logout navigation started");
    main_progress.show();
    var temp = fb.authUpdate(function (user) {
      if (!user) {
        temp();
        router.login();
      }
    });
    fb.logout();
    main_progress.hide();
  };

  challenge(challenge_id: string): void {
    Router.redirect_log("#0F0", "Loading challenge");
    main_progress.show();

    var challengeNode = fb.path('challenges', challenge_id);
    var membersNode = fb.path('memberships', challenge_id);
    var filesNode = fb.path('files', challenge_id);
    var messagesNode = fb.path('messages', challenge_id);

    var challengeData;
    var membersData;
    var filesData;
    var messagesData;

    var renderUI = () => {
      var currentUserId = fb.user.uid;
      if (all_defined(challengeData, membersData, filesData, messagesData)) {
        this.redirect("challenge", {
          "challenge": challengeData,
          "users": membersData,
          "files": filesData,
          "messages": messagesData
        }, challenge_id);
        this.render_icons();
        var mi = $("#messageInput");
        $("#send").click(function () {
          var text = mi.val();
          messagesNode.push({"user": currentUserId, "message": text, "created": fb.now});
          mi.val("");
        });
        var join = $("#join");
        join.click(function () {
          membersNode.child(currentUserId).set(true);
          const statusNode = challengeNode.child("status");
          statusNode.once('value', (snapshot) => {
            if (snapshot.val() === 'unstarted') {
              statusNode.set("unsolved");
            }
          })
        });
        if (membersData && currentUserId in membersData) {
          join.attr("disabled", "true");
          join.text("Already joined");
        }
        var solved = $("#solve");
        if (challengeData.status === "solved") {
          solved.attr("disabled", "true");
          solved.text("Already solved");
        }
        solved.click(function () {
          challengeNode.child("status").set("solved");
        });
        var dialogue = <Dialogue> $("#dialog")[0];
        $("#upload").click(function () {
          dialogue.showModal();
        });
        $("#upload_close").click(function () {
          dialogue.close();
        });
        $("#upload_upload").click(function () {
          var node = filesNode.push();
          var file_input: HTMLInputElement = <HTMLInputElement> $("#file-input")[0];
          var file = file_input.files[0];
          var challengeDataNode = firebase.storage().ref().child(challenge_id).child(node.key);
          var task = challengeDataNode.put(file);
          task.on('state_changed', function (snapshot) {
            console.log(snapshot);
          }, function (error) {
            console.log(error);
          }, function () {
            node.set({"name": $("#file-name").val(), "url": task.snapshot.downloadURL});
          });
        });
        $("main").addClass("back-" + challengeData.status);
      }


      main_progress.hide(function () {
        var main_element = $("main");
          for (var current of main_element.attr("class").split(" ")) {
          if (current.startsWith("back-")) {
            main_element.removeClass(current);
          }
        }
        challengeNode.off('value', challengeListener);
        membersNode.off('value', membersListener);
        filesNode.off('value', filesListener);
        messagesNode.off('value', messagesListener);
      });
    };

    var challengeListener = function (snapshot) {
      challengeData = snapshot.val();
      renderUI();
    };

    var membersListener = function (snapshot) {
      membersData = snapshot.val();
      renderUI();
    };

    var filesListener = function (snapshot) {
      filesData = snapshot.val();
      renderUI();
    };


    var messagesListener = function (snapshot) {
      messagesData = snapshot.val();
      renderUI();
    };

    challengeNode.on('value', challengeListener);
    membersNode.on('value', membersListener);
    filesNode.on('value', filesListener);
    messagesNode.on('value', messagesListener);
  };

  redirect_to_url(pathname?: string): void {
    pathname = !!pathname ? pathname : window.location.pathname;
    switch (pathname) {
      case "":
      case "/":
        this.index();
        return;
      case "/users":
      case "/users/":
        this.users();
        return;
      case "/challenges":
      case "/challenges/":
        this.challenges();
        return;
      case "/logout":
      case "/logout/":
        this.logout();
        return;
      case "/link/":
      case "/link":
        this.link();
        return;
    }
    var match = pathname.match("\/([^/]*)\/([^/]+)/?");
    if (match) {
      var pageName = match[1];
      var id = match[2];
      switch (pageName) {
        case "challenge":
          this.challenge(id);
          return;
        case "user":
          this.user(id);
          return;
      }
    }
    this.load_error("Page not found");
  }
}

var router = new Router();

$(function () {
  window.onpopstate = function (event) {
    router.redirect_to_url(event.currentTarget.location.pathname);
  };

  fb.authOnce(function (user: FirebaseUser) {
    if (user) {
      router.redirect_to_url();
    } else {
      router.login();
    }
  });
});
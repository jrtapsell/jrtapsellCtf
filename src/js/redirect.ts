class ProgressManager {
  private deregister;
  constructor(selector) {
    this.deregister = undefined;
    this.selector = $(selector);
    show() {
      if (!active) {
        active = true;
        if (deregister) {
          deregister();
          deregister = null;
        }
        console.time("main progress shown");
        jq.show();
      }
    };

    hide(on_move) {
      if (active) {
        active = false;
        deregister = on_move;
        console.timeEnd("main progress shown");
        jq.hide();
      }
    };
  }
}
var main_progress = {};

$(function () {
  var deregister;
  var jq = $("#statusBar");
  var active = false;

  main_progress.show = function () {
    if (!active) {
      active = true;
      if (deregister) {
        deregister();
        deregister = null;
      }
      console.time("main progress shown");
      jq.show();
    }
  };

  main_progress.hide = function (on_move) {
    if (active) {
      active = false;
      deregister = on_move;
      console.timeEnd("main progress shown");
      jq.hide();
    }
  };
});

var router = {};

$(function () {
  'use strict';

  function redirect_log(color, messageContents, data) {
    console.colourLog("#00F", color, messageContents, data);
  }

  function render_icons() {
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

  function load_error(_, message) {
    $("#page-content").html("<h1>" + message + "</h1>");
    main_progress.hide();
  }

  function redirect(page, contents, id) {
    redirect_log("#F00", "Render started", [page, contents]);
    $("#page-content").html(CTF.pages[page](contents));
    redirect_log("#F00", "Render completed ");
    var tail = !!id ? page + "/" + id : page;
    history.pushState(null, "", "https://ctf.jrtapsell.co.uk/" + tail + "/");
    componentHandler.upgradeDom();
  }

  router.login = function() {
    redirect_log("#0F0", "Login navigation started");
    main_progress.show();
    redirect("login");
    var unsubscribe = fb.authUpdate(function (user) {
      if (user) {
        unsubscribe();
        router.index();
      }
    });
    $("#google-login").click(fb.googleLogin);
    $("#github-login").click(fb.githubLogin);
    main_progress.hide();
  };

  /**
   * Routes to the index page
   *
   * @return {void}
   */
  router.index = function() {
    redirect_log("#0F0", "Index navigation started");
    main_progress.show();
    redirect("index", null);
    main_progress.hide();
  };

  router.users = function() {
    redirect_log("#0F0", "Users navigation started");
    main_progress.show();
    var usersNode = fb.path('users');
    var listener = function (snapshot) {
      var value = snapshot.val();
      if (value) {
        var users = Object.values(value);
        redirect("users", {"users": users});
        $(".card-title").each(function (_, item) {
          var current = $(item);
          current.css("background", "url(" + current.attr("data-background") + ") center / cover");
        });
      } else {
        $("#page-content").html("<h2>No users</h2>");
      }
      $(".user-card").each(function (_, item) {
        var id = item.dataset.id;
        var jq_item = $(item);
        jq_item.click(function () {
          router.user(id);
        });
      });
      main_progress.hide(function () {
        usersNode.off("value", listener);
      });
    };
    usersNode.on('value', listener);
  };

  router.user = function(user_id) {
    redirect_log("#0F0", "User navigation started");
    main_progress.show();
    var usersNode = fb.path('users', user_id);
    var listener = function (snapshot) {
      var value = snapshot.val();
      if (value) {
        redirect("user", value, user_id);
      } else {
        $("#page-content").html("<h2>No such user</h2>");
      }
      main_progress.hide(function () {
        usersNode.off("value", listener);
      });
    };
    usersNode.on('value', listener);
  };

  router.challenges = function() {
    redirect_log("#0F0", "Challenges navigation started");
    main_progress.show();

    function renderUI() {
      if (all_defined(challengesData, usersData)) {
        var temp = {};
        $.each(challengesData, function (key, value) {
          temp[key] = value;
          temp[key].users = usersData[key];
        });
        redirect("challenges", {"challenges": temp});
        $(".challenge-row").click(function (event) {
          router.challenge(event.currentTarget.dataset.id);
        });
        render_icons();
      } else {
        $("#page-content").html("<h2>No challenges</h2>");
      }

      main_progress.hide(function () {
        challengesNode.off("value", challengesListener);
        usersNode.off("value", usersListener);
      });
    }

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


  router.logout = function() {
    redirect_log("#0F0", "Logout navigation started");
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

  router.challenge = function(challenge_id) {
    redirect_log("#0F0", "Loading challenge");
    main_progress.show();

    var challengeNode = fb.path('challenges', challenge_id);
    var membersNode = fb.path('memberships', challenge_id);
    var filesNode = fb.path('files', challenge_id);
    var messagesNode = fb.path('messages', challenge_id);

    var challengeData;
    var membersData;
    var filesData;
    var messagesData;

    function renderUI() {
      var currentUserId = fb.user.uid;
      if (all_defined(challengeData, membersData, filesData, messagesData)) {
        redirect("challenge", {
          "challenge": challengeData,
          "users": membersData,
          "files": filesData,
          "messages": messagesData
        }, challenge_id);
        render_icons();
        var mi = $("#messageInput");
        $("#send").click(function () {
          var text = mi.val();
          messagesNode.push({"user": currentUserId, "message": text, "created": fb.now});
          mi.val("");
        });
        var join = $("#join");
        join.click(function () {
          membersNode.child(currentUserId).set(true);
        });
        if (currentUserId in membersData) {
          join.attr("disabled", true);
        }
        var solved = $("#solve");
        if (challengeData.status === "solved") {
          solved.attr("disabled", true);
        }
        solved.click(function () {
          challengeNode.child("status").set("solved");
        });
        var dialogue = $("#dialog")[0];
        $("#upload").click(function () {
          dialogue.showModal();
        });
        $("#upload_close").click(function () {
          dialogue.close();
        });
        $("#upload_upload").click(function () {
          var node = filesNode.push();
          var file = $("#file-input")[0].files[0];
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
      }


      main_progress.hide(function () {
        challengeNode.off('value', challengeListener);
        membersNode.off('value', membersListener);
        filesNode.off('value', filesListener);
        messagesNode.off('value', messagesListener);
      });
    }

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

  function redirect_to_url(pathname) {
    pathname = !!pathname ? pathname : window.location.pathname;
    switch (pathname) {
      case "":
      case "/":
        router.index();
        return;
      case "/users":
      case "/users/":
        router.users();
        return;
      case "/challenges":
      case "/challenges/":
        router.challenges();
        return;
      case "/logout":
      case "/logout/":
        router.logout();
        return;
    }
    var match = pathname.match("\/([^/]*)\/([^/]+)/?");
    if (match) {
      var pageName = match[1];
      var id = match[2];
      switch (pageName) {
        case "challenge":
          router.challenge(id);
          return;
        case "user":
          router.user(id);
          return;
      }
    }
    load_error(undefined, "Page not found");
  }

  window.onpopstate = function (event) {
    redirect_to_url(event.currentTarget.location.pathname);
  };

  fb.authOnce(function (user) {
    if (user) {
      redirect_to_url();
    } else {
      router.login();
    }
  });
});
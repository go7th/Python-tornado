#!/usr/bin/env python
# -*- coding: UTF-8 -*-
# Copyright 2009 Facebook
#
# Licensed under the Apache License, Version 2.0 (the "License"); you may
# not use this file except in compliance with the License. You may obtain
# a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
# WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
# License for the specific language governing permissions and limitations
# under the License.

import bcrypt
import concurrent.futures
import MySQLdb
import markdown
import os.path
import re
import subprocess
import torndb
import tornado.escape
from tornado import gen
import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
import unicodedata
import json
# import JsonHandler



from tornado.options import define, options

define("port", default=7272, help="run on the given port", type=int)
define("mysql_host", default="127.0.0.1:3306", help="blog database host")
define("mysql_database", default="n_pro", help="blog database name")
define("mysql_user", default="root", help="blog database user")
define("mysql_password", default="root", help="blog database password")


# A thread pool to be used for password hashing with bcrypt.
executor = concurrent.futures.ThreadPoolExecutor(2)


class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            # (r"/test", TestHandler),  
            (r"/md", MdHandler),  
            (r"/mdgetone/(\d*)", MdGetOneHandler),
            
            (r"/", HomeHandler),
            (r"/index", HomeHandler),            
            (r"/about", AboutHandler),            
            (r"/contact", ContactHandler),
            (r"/login", LoginHandler),
            (r"/reg", RegHandler),
            (r"/logout", LogoutHandler),
            (r"/news/(\d*)", NewsHandler),
            (r"/newslist", NewsListHandler),
            (r"/product", ProductHandler),
            (r"/recruit", RecruitHandler),
            (r"/solve", SolveHandler),
            
                 
            # (r"/archive", ArchiveHandler),
            # (r"/feed", FeedHandler),
            # (r"/entry/([^/]+)", EntryHandler),
            # (r"/compose", ComposeHandler),
            # (r"/datas", DatasHandler),
            # (r"/admin", AdminHandler),
            
        ]
        settings = dict(
            blog_title=u"Tornado Blog",
            template_path=os.path.join(os.path.dirname(__file__), "templates"),
            static_path=os.path.join(os.path.dirname(__file__), "static"),
            ui_modules={"Entry": EntryModule},
            xsrf_cookies=True,
            cookie_secret="__TODO:_GENERATE_YOUR_OWN_RANDOM_VALUE_HERE__",
            login_url="/auth/login",
            debug=True,
        )
        super(Application, self).__init__(handlers, **settings)
        # Have one global connection to the blog DB across all handlers
        # self.db = torndb.Connection(
        #     host=options.mysql_host, database=options.mysql_database,
        #     user=options.mysql_user, password=options.mysql_password)

        # self.maybe_create_tables()

    # def maybe_create_tables(self):
    #     try:
    #         self.db.get("SELECT COUNT(*) from entries;")
    #     except MySQLdb.ProgrammingError:
    #         subprocess.check_call(['mysql',
    #                                '--host=' + options.mysql_host,
    #                                '--database=' + options.mysql_database,
    #                                '--user=' + options.mysql_user,
    #                                '--password=' + options.mysql_password],
    #                               stdin=open('schema.sql'))


class BaseHandler(tornado.web.RequestHandler):
    @property
    def db(self):
        return self.application.db

    def get_current_user(self):
        user_id = self.get_secure_cookie("blogdemo_user")
        if not user_id:
            return None
        return self.db.get("SELECT * FROM authors WHERE id = %s", int(user_id))

    def any_author_exists(self):
        return bool(self.db.get("SELECT * FROM authors LIMIT 1"))


class HomeHandler(BaseHandler):
    def get(self):
        entries = self.db.query("SELECT * FROM entries ORDER BY published "
                                "DESC LIMIT 5")
        if not entries:
            self.redirect("/compose")
            return
        self.render("index.html")


# class EntryHandler(BaseHandler):
#     def get(self, slug):
#         entry = self.db.get("SELECT * FROM entries WHERE slug = %s", slug)
#         if not entry:
#             raise tornado.web.HTTPError(404)
#         self.render("entry.html", entry=entry)


# class ArchiveHandler(BaseHandler):
#     def get(self):
#         entries = self.db.query("SELECT * FROM entries ORDER BY published "
#                                 "DESC")
#         self.render("archive.html", entries=entries)


# class FeedHandler(BaseHandler):
#     def get(self):
#         entries = self.db.query("SELECT * FROM entries ORDER BY published "
#                                 "DESC LIMIT 10")
#         self.set_header("Content-Type", "application/atom+xml")
#         self.render("feed.xml", entries=entries)


# class ComposeHandler(BaseHandler):
#     @tornado.web.authenticated
#     def get(self):
#         id = self.get_argument("id", None)
#         entry = None
#         if id:
#             entry = self.db.get("SELECT * FROM entries WHERE id = %s", int(id))
#         self.render("compose.html", entry=entry)

#     @tornado.web.authenticated
#     def post(self):
#         id = self.get_argument("id", None)
#         title = self.get_argument("title")
#         text = self.get_argument("markdown")
#         html = markdown.markdown(text)
#         if id:
#             entry = self.db.get("SELECT * FROM entries WHERE id = %s", int(id))
#             if not entry:
#                 raise tornado.web.HTTPError(404)
#             slug = entry.slug
#             self.db.execute(
#                 "UPDATE entries SET title = %s, markdown = %s, html = %s "
#                 "WHERE id = %s", title, text, html, int(id))
#         else:
#             slug = unicodedata.normalize("NFKD", title).encode(
#                 "ascii", "ignore")
#             slug = re.sub(r"[^\w]+", " ", slug)
#             slug = "-".join(slug.lower().strip().split())
#             if not slug:
#                 slug = "entry"
#             while True:
#                 e = self.db.get("SELECT * FROM entries WHERE slug = %s", slug)
#                 if not e:
#                     break
#                 slug += "-2"
#             self.db.execute(
#                 "INSERT INTO entries (author_id,title,slug,markdown,html,"
#                 "published) VALUES (%s,%s,%s,%s,%s,UTC_TIMESTAMP())",
#                 self.current_user.id, title, slug, text, html)
#         self.redirect("/entry/" + slug)

# class DatasHandler(BaseHandler):
#     def get(self):
#         self.render("datas.html")
#     pass
# class AdminHandler(BaseHandler):
#     @tornado.web.authenticated    
#     def get(self):
#         self.render('admin/index.html', user=self.current_user)
#         # user_id = self.get_secure_cookie("blogdemo_user")
#         # if current_user
#         #     self.render("admin/index.html")
#         # else:
#         #     self.render("login.html")
#         # pass


class RegHandler(BaseHandler):
    def get(self):
        self.render("login.html")

    @gen.coroutine
    def post(self):
        if self.any_author_exists():
            raise tornado.web.HTTPError(400, "author already created")
        hashed_password = yield executor.submit(
            bcrypt.hashpw, tornado.escape.utf8(self.get_argument("password")),
            bcrypt.gensalt())
        author_id = self.db.execute(
            "INSERT INTO authors (email, name, hashed_password) "
            "VALUES (%s, %s, %s)",
            self.get_argument("email"), self.get_argument("name"),
            hashed_password)
        self.set_secure_cookie("blogdemo_user", str(author_id))
        self.redirect(self.get_argument("next", "/"))


class LoginHandler(BaseHandler):
    def get(self):
        # If there are no authors, redirect to the account creation page.
        if not self.any_author_exists():
            self.redirect("/reg")
        else:
            self.render("login.html", error=None)

    @gen.coroutine
    def post(self):
        author = self.db.get("SELECT * FROM authors WHERE email = %s",
                             self.get_argument("email"))
        if not author:
            self.render("login.html", error="email not found")
            return
        hashed_password = yield executor.submit(
            bcrypt.hashpw, tornado.escape.utf8(self.get_argument("password")),
            tornado.escape.utf8(author.hashed_password))
        if hashed_password == author.hashed_password:
            self.set_secure_cookie("blogdemo_user", str(author.id))
            self.redirect(self.get_argument("next", "/admin"))
        else:
            self.render("login.html", error="incorrect password")


class LogoutHandler(BaseHandler):
    def get(self):
        self.clear_cookie("blogdemo_user")
        self.redirect(self.get_argument("next", "/"))

class AboutHandler(BaseHandler):
    def get(self):
        self.render("about.html")
    pass

class NewsListHandler(BaseHandler):
    def get(self):
        self.render("newslist.html")
    pass

class NewsHandler(BaseHandler):
    def get(self,id):
        self.render("news.html",id=id)
    pass

class ProductHandler(BaseHandler):
    def get(self):
        self.render("product.html")
    pass

class SolveHandler(BaseHandler):
    def get(self):
        self.render("solve.html")
    pass
class RecruitHandler(BaseHandler):
    def get(self):
        self.render("recruit.html")
    pass
class ContactHandler(BaseHandler):
    def get(self):
        self.render("contact.html")
    pass
# class TestHandler(BaseHandler):
#     def get(self):
#         self.render("test.html")
#     pass





# class TestApiHandler(BaseHandler):
#     def get(self,id):
#         path='news_md'
#         contents = []
#         data=''
#         # file_num=0
#         # contents_d={}
#         for lists in os.listdir(path):
#             sub_path = os.path.join(path, lists)
#             # file_num=file_num+1
#             if os.path.isfile(sub_path):
#                 with open(sub_path) as f:
#                     # contents_d[file_num]=f.read()
#                     # data_d = json.dumps(contents)
#                     contents.append(f.read())
#             data = json.dumps(contents[id])
#                     # data = json.dumps({"data":contents})
#         self.write(data)
#         # file_num = json.dumps(file_num)
#         # self.write(data)
        
        
#     pass
class MdGetOneHandler(BaseHandler):
    def get(self,id):        
        path='news_md'
        contents = []
        data=''
        id=id+".md"
        if os.path.isfile('news_md/'+id):
            content = {}            
            with open('news_md/'+id) as f:
                # content['url']=f.readline().strip('\n')                                     
                content['title']=f.readline().strip('\n') 
                content['time']=f.readline().strip('\n') 
                content['describe']=f.readline()
                content['src']=f.readline().strip('\n') 
                content['content'] =""
                while True:  
                    line = f.readline()  
                    content['content'] += line
                    if not line:  
                        break  
                content['status']="yes"
                contents.append(content)
                data = json.dumps(contents[0])
                self.write(data)
        else:
            content = {}  
            content['status']="no"
            contents.append(content)
            data = json.dumps(contents[0])
            self.write(data)
        
        
    pass

class MdHandler(BaseHandler):
    def get(self):
        path='news_md'
        contents = []
        data=''
        for lists in os.listdir(path):
            sub_path = os.path.join(path, lists)
            if os.path.isfile(sub_path):
                content = {}            
                with open(sub_path) as f:
                    # content['url']=f.readline().strip('\n')                     
                    content['title']=f.readline().strip('\n') 
                    content['time']=f.readline().strip('\n') 
                    content['describe']=f.readline()
                    content['src']=f.readline().strip('\n') 
                    # content['content'] =""
                    # while True:  
                    #     line = f.readline()  
                    #     content['content'] += line
                    #     if not line:  
                    #         break  
            contents.append(content)
            
        data = json.dumps(contents)
        self.write(data)
        
        
    pass
    

class EntryModule(tornado.web.UIModule):
    def render(self, entry):
        return self.render_string("modules/entry.html", entry=entry)


def main():
    tornado.options.parse_command_line()
    http_server = tornado.httpserver.HTTPServer(Application())
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.current().start()


if __name__ == "__main__":
    main()

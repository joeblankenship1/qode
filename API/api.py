from eve import Eve
from eve.auth import BasicAuth
from flask_cors import CORS

class Authenticate(BasicAuth):
    def check_auth(self, username, password, allowed_roles, resource,
                   method):
        if resource == 'user' and method == 'POST':
            return username == 'admin' and password == 'admin'
        else :
            user = app.data.driver.db['user']
            user = user.find_one({'username': username,'password':password})
            if user:
                return True
            else:
                return False

app = Eve()

if __name__ == '__main__':
    #app = Eve(auth=Authenticate)
    app = Eve()
    CORS(app)
    app.run()

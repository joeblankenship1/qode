# Qode
Qode is an open source project designed to do qualitative data analysis. Its written in Angular4 and works with a python based API based on Eve and Flask.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

In Debian/Ubuntu or macOS

#### Install NodeJs

```
sudo apt-get update
sudo apt-get install nodejs
```

Algo install **npm**
```
sudo apt-get install npm
```

#### If not installed already, get Python v3.6. 

```
sudo apt-get update
sudo apt-get install python3.6
```

#### MongoDB

Finally, install MongoDB from it official website [https://www.mongodb.com/download-center?jmp=nav#community]


### Installing

Is recommended to start creating a **virtualenv**:
```
sudo pip3 install virtualenv  
```

Now create a virtual environment 
```
virtualenv --p=/usr/bin/python3.6 qodevenv
```
Then activate your **virtualenv**
```
source qodevenv/bin/activate
```

First get the source code
```
cd
git clone https://github.com/nurruty/qode.git
```
Then install al the dependecies needed.
```
cd qode
pip install -r requirements.txt
```
Then all Angular packages
```
npm install
```

## Run

### Start MongoDB

To get Qode up and running you need first start the mongo service. We recommend direct it to API/data/db but you cant do it where ever you want. 

```
service mongod stop
sudo mongod --dbpath=/home/<user>/qode/API/data/db
```
### Start Python-Eve API

Open another terminal and start a new **virtualenv**, enter the API folder and run:

```
cd API
python server.py
```

### Start the Angular's development server

Open one last terminal and run:

```
ng serve
```

Finally browse to [http://localhost:4200/](http://localhost:4200/)

## Built With

* [AngularJS](https://angular.io/docs) - The web framework used
* [Python-Eve](http://python-eve.org/) - REST API framework  used
* [MongoDB](https://www.mongodb.com/) - DataBase used


## Authors

* **Carina Soca** - [CariSoca](https://github.com/CariSoca)
* **Santiago Camou** - [santicamou](https://github.com/santicamou)
* **Nicolas Urruty** - [nurruty](https://github.com/nurruty)

See also the list of [contributors](https://github.com/nurruty/qode/contributors) who participated in this project.

## License

This project is licensed under the Apache License 2.0 License - see the [LICENSE.md](LICENSE.md) file for details



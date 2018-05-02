# Qode
Qode is an open source project designed to do qualitative data analysis. Its written in Angular4 and works with a python based API based on Eve and Flask.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

#### Install NodeJs v8.3.0

In Debian/Ubuntu or macOS
```
sudo apt-get update
sudo apt-get install nodejs
```

Algo install **npm**
```
sudo apt-get install npm
```

#### If not installed already, get Python v3.5 or better create a virtualenv.

Install **pip** first

```
sudo apt-get install python3-pip 
```

Then install **virtualenv** using pip3

```
sudo pip3 install virtualenv  
```

Now create a virtual environment 

```
virtualenv -p python3 qodevenv
```
Then activate your **virtualenv**
```
source qodevenv/bin/activate
```

Finally, install MongoDB from it official website [https://www.mongodb.com/download-center#atlas]


### Installing

First get the source code

```
cd
git clone https://github.com/nurruty/qode.git
```
Then install al the dependecies needed

First all Python requirements
```
cd qode
pip install requirements.txt
```

Then all Anglar packages
```
npm install
```


## Run

### Start MongoDB

To get Qode up and running you need first start the mongo service. We recommend direct it to API/data/db but you cant do it where ever you want. Open a new terminal and init the **virtualenv** as explained before.
Then run:

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

Finally browse to [localhost:4200]

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



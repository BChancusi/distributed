# Distributed Budgeting System

Web application designed to allow multiple users to input financial data concurrently leverging branches and committing. 

## Getting Started

### Prerequisites

```
MySQL, Node.js, NPM.
```

### Installing

####Create database tables

```
create schema budgeting collate utf8mb4_0900_ai_ci;

create table reports
(
	id int auto_increment,
	title varchar(200) not null,
	timestamp timestamp default CURRENT_TIMESTAMP not null,
	permission int default 0 not null,
	constraint reports_id_uindex
		unique (id),
	constraint reports_title_uindex
		unique (title)
);

alter table reports
	add primary key (id);

create table files
(
	id int auto_increment,
	report_id int not null,
	branch_title varchar(200) collate utf8mb4_bin default 'master' not null,
	title varchar(200) collate utf8mb4_bin not null,
	timestamp timestamp default CURRENT_TIMESTAMP not null,
	constraint files_id_uindex
		unique (id),
	constraint files_reports_id_fk
		foreign key (report_id) references reports (id)
			on delete cascade
);

alter table files
	add primary key (id);

create table fields
(
	id int auto_increment,
	file_Id int not null,
	branch_title varchar(200) collate utf8mb4_bin default 'master' not null,
	title varchar(200) not null,
	value decimal(20,2) default 0.00 not null,
	timestamp timestamp default CURRENT_TIMESTAMP not null,
	constraint fields_id_uindex
		unique (id),
	constraint fields_files_id_fk
		foreign key (file_Id) references files (id)
			on delete cascade
);

alter table fields
	add primary key (id);

create table users
(
	id int auto_increment,
	username varchar(200) not null,
	password varchar(200) not null,
	permission int(5) default 0 not null,
	constraint Users_username_uindex
		unique (username),
	constraint users_id_uindex
		unique (id)
);

alter table users
	add primary key (id);
```


####Create .env file
```
DB_HOST = yourDBHost
DB_USER = yourDBUsername
DB_PASSWORD = yourDatabasePasswrod
DB_DATABASE = yourDatabase
SESSION_PASSWORD = random key
```

Run both server and client enviroments

```
npm run dev
```

Running application

![Image of running application](https://i.imgur.com/8qfyiT0.png)

Project URL: https://distributed-budgeting.herokuapp.com/



## Running the tests
```
npm run test
```

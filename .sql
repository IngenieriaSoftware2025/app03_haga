CREATE DATABASE app03_haga

create table clientes(
id serial primary key not null,
nombre varchar(50) not null,
apellido varchar(50),
telefono int,
nit varchar(15),
correo varchar(100),
situacion smallint default 1
);

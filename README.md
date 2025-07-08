nextjs = 15.3.4
shadcn = 2.7.0

docker run -d --name postgres-db -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=12345678 -p 5432:5432 postgres
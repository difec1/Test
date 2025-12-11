export default ({ env }) => ({
  connection: {
    client: env('DATABASE_CLIENT', 'sqlite'),
    connection: env('DATABASE_CLIENT', 'sqlite') === 'sqlite'
      ? {
          filename: env('DATABASE_FILENAME', '.tmp/data.db'),
        }
      : {
          host: env('DATABASE_HOST', '127.0.0.1'),
          port: env.int('DATABASE_PORT', 5432),
          database: env('DATABASE_NAME', 'smartbudgetai'),
          user: env('DATABASE_USERNAME', 'postgres'),
          password: env('DATABASE_PASSWORD', ''),
          ssl: env.bool('DATABASE_SSL', false),
        },
    useNullAsDefault: true,
  },
});

import { join } from 'path'
import { ConnectionOptions } from 'typeorm' 
const PROD_ENV = 'production'
 
const connectionOptions: ConnectionOptions = {
    type: 'mysql',
    host: 'dev-tgt.local',
    port: 3306,
    username: 'root',
    password: '',
    database: 'nest',
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: process.env.APP_ENV === 'dev',
  // We are using migrations, synchronize should be set to false. 
  dropSchema: false,
  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  migrationsRun: true,
  logging: ['warn', 'error'],
  logger: process.env.NODE_ENV === PROD_ENV ? 'file' : 'debug',
  migrations: [
    join(__dirname, 'migrations/*{.ts,.js}')
  ],
  cli: {
    migrationsDir: 'src/migrations'
  }
}

export = connectionOptions
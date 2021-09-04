import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Configuration } from 'src/config/configuration';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  onModuleInit() {
    const config = this.configService.get<Configuration>('config');
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: config.firebase.projectId,
        privateKey: config.firebase.privateKey,
        clientEmail: config.firebase.clientEmail,
      }),
    });
  }

  async validateRequest(request: any): Promise<User | null> {
    console.log('===');
    try {
      const idToken = request.get('Authorization');
      console.log({ idToken });
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const { sub, name, email } = decodedToken;
      let user = await this.usersRepository.findOne({ sub });
      console.log({ user });
      if (user === undefined) {
        user = this.usersRepository.create({
          sub,
          name,
          email,
        });
        this.usersRepository.save(user);
      }
      console.log('===');
      return user;
    } catch (err) {
      console.log({ err });
      return null;
    }
  }
}

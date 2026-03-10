// import { Component } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

// @Component({
//   standalone: true,
//   selector: 'app-register',
//   imports: [FormsModule],
//   template: `
//     <h2>Register</h2>
//     <input [(ngModel)]="email" placeholder="Email"><br><br>
//     <input [(ngModel)]="password" type="password" placeholder="Password"><br><br>
//     <button (click)="register()">Register</button>
//   `
// })
// export class RegisterComponent {
//   email = '';
//   password = '';

//   register() {
//     createUserWithEmailAndPassword(getAuth(), this.email, this.password)
//       .then(() => alert('Registration Success'))
//       .catch(err => alert(err.message));
//   }
// }
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl:'./register.html',
  styleUrl:'./register.css'
})
export class RegisterComponent {

  name = '';
  phone = '';
  email = '';
  password = '';

  async register() {
    try {
      // 1️⃣ Create user in Firebase Auth
      const result = await createUserWithEmailAndPassword(
        getAuth(),
        this.email,
        this.password
      );

      // 2️⃣ Get logged-in user ID
      const uid = result.user.uid;

      // 3️⃣ Save extra details in Firestore
      await setDoc(doc(getFirestore(), 'users', uid), {
        name: this.name,
        phone: this.phone,
        email: this.email,
        createdAt: new Date()
      });

      alert('Registration Successful');

    } catch (error: any) {
      alert(error.message);
    }
  }
}
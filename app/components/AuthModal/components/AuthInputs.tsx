import * as React from "react";

interface Props {
  inputs: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    city: string;
    password: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSignin: boolean;
}

export default function AuthInputs({ inputs, onChange, isSignin }: Props) {
  return (
    <div>
      {isSignin ? null : (
        <div className="my-3 flex justify-between text-sm">
          <input
            type="text"
            className="border rounded p-2 py-3 w-[49%] "
            placeholder="First Name"
            value={inputs.firstName}
            onChange={onChange}
            name="firstName"
          />
          <input
            type="text"
            className="border rounded p-2 py-3 w-[49%] "
            placeholder="Last Name"
            value={inputs.lastName}
            onChange={onChange}
            name="lastName"
          />
        </div>
      )}
      <div className="my-3 flex justify-between text-sm">
        <input
          type="email"
          className="border rounded p-2 py-3 w-full "
          placeholder="Email"
          value={inputs.email}
          onChange={onChange}
          name="email"
        />
      </div>
      {isSignin ? null : (
        <div className="my-3 flex justify-between text-sm">
          <input
            type="tel"
            className="border rounded p-2 py-3 w-[49%] "
            placeholder="Phone"
            value={inputs.phone}
            onChange={onChange}
            name="phone"
          />
          <input
            type="text"
            className="border rounded p-2 py-3 w-[49%] "
            placeholder="City"
            value={inputs.city}
            onChange={onChange}
            name="city"
          />
        </div>
      )}
      <div className="my-3 flex justify-between text-sm">
        <input
          type="password"
          className="border rounded p-2 py-3 w-full "
          placeholder="Password"
          value={inputs.password}
          onChange={onChange}
          name="password"
        />
      </div>
    </div>
  );
}

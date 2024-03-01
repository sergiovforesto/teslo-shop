'use client'
import Link from "next/link"
import { useFormState, useFormStatus } from "react-dom";
import { authenticate } from "@/actions";
import { IoCheckmarkCircleOutline, IoCheckmarkDoneCircleOutline, IoInformationCircleOutline } from "react-icons/io5";
import clsx from "clsx";
import { useEffect } from "react";

export const LoginForm = () => {

    const [state, dispatch] = useFormState(authenticate, undefined);

    useEffect(() => {
        if(state === "Success") {
            window.location.replace('/')

        }
    }, [state])

    return (
        <>
            <form action={dispatch} className="flex flex-col">

                <label htmlFor="email">Correo electrónico</label>
                <input
                    className="px-5 py-2 border bg-gray-200 rounded mb-5"
                    name="email"
                    type="email" />


                <label htmlFor="email">Contraseña</label>
                <input
                    className="px-5 py-2 border bg-gray-200 rounded mb-5"
                    name="password"
                    type="password" />
                <div
                    className="flex h-8 items-end space-x-1"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    {state && (
                        <div className={
                            
                            clsx(
                                'mb-2 flex justify-center items-center w-full',
                                {
                                    'hidden' : state === 'Success'
                                }
                            )
                        }>
                            <IoInformationCircleOutline className="h-5 w-5 text-rose-500" />
                            <p className="text-sm text-rose-500">Credenciales no son correctas</p>
                        </div>
                    )}

                    {state === 'Success' && (
                        <div className="mb-2 flex justify-center items-center w-full">
                            <IoCheckmarkCircleOutline className="h-5 w-5 text-green-500" />
                            <p className="text-sm text-green-500">Login success</p>
                        </div>
                    )}
                </div>
                <LoginButton />


                {/* divisor l ine */}
                <div className="flex items-center my-5">
                    <div className="flex-1 border-t border-gray-500"></div>
                    <div className="px-2 text-gray-800">O</div>
                    <div className="flex-1 border-t border-gray-500"></div>
                </div>

                <Link
                    href="/auth/new-account"
                    className="btn-secondary text-center">
                    Crear una nueva cuenta
                </Link>

            </form>
        </>
    )
}

function LoginButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            className={
                clsx(
                    {
                        'btn-primary': !pending,
                        'btn-disabled': pending
                    }
                )
            }
            disabled={pending}
        >
            Ingresar
        </button>
    );
}

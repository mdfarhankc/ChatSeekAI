import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginValues } from "@/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router";
import { useLogin } from "@/hooks/useLogin";

export default function LoginPage() {
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { login, isLoading } = useLogin();

  async function onSubmit(values: LoginValues) {
    login(values);
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="max-w-md bg-card w-full space-y-8 p-8 border rounded-3xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold">ChatSeekAI</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Sign in to your account
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} type="password" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full font-bold" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
            <div className="text-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Don't have an account?
              </span>
              <Button variant={"link"} asChild>
                <Link to="/register">Sign up</Link>
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
}

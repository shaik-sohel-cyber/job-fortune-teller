
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this data to a server
    toast({
      title: "Message Sent",
      description: "We'll get back to you as soon as possible!",
    });
    setName("");
    setEmail("");
    setMessage("");
  };

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6 text-primary" />,
      title: "Email",
      details: "jobpred@gmail.com",
      link: "mailto:jobpred@gmail.com"
    },
    {
      icon: <Phone className="h-6 w-6 text-primary" />,
      title: "Phone",
      details: "+91 9121865061",
      link: "tel:+919121865061"
    },
    {
      icon: <MapPin className="h-6 w-6 text-primary" />,
      title: "Location",
      details: "Hyderabad, Telangana, India",
      link: "https://maps.google.com/?q=Hyderabad,Telangana,India"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-20 pb-10 px-4"
    >
      <div className="max-w-5xl mx-auto">
        <div className="mb-16 text-center">
          <motion.h1 
            className="text-4xl font-bold tracking-tight text-foreground mb-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Contact Us
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Get in touch with our team
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {contactInfo.map((item, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className="h-full transition-all hover:shadow-md">
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto bg-primary/10 p-3 rounded-full mb-2">
                    {item.icon}
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base">{item.details}</CardDescription>
                </CardContent>
                <CardFooter className="justify-center pt-0">
                  <Button variant="link" className="text-primary" onClick={() => window.open(item.link, "_blank")}>
                    Connect with us
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <Card>
            <CardHeader>
              <CardTitle>Send Us a Message</CardTitle>
              <CardDescription>
                Have questions or need assistance? Fill out the form below and we'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-name">Name</Label>
                  <Input 
                    id="contact-name" 
                    placeholder="Your name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email</Label>
                  <Input 
                    id="contact-email" 
                    type="email" 
                    placeholder="Your email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-message">Message</Label>
                  <Textarea 
                    id="contact-message" 
                    placeholder="Your message" 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[150px]"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Send className="mr-2 h-4 w-4" /> Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ContactUs;

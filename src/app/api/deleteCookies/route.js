export async function POST() {

   return new Response(JSON.stringify({ success: "Cookies deletados com sucesso!" }), {
      status: 200,
      headers: { 
         "Content-Type": 'application/json',
         "Set-Cookie": [
            'access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict;',
            'refresh_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict;',
         ]
      }
   })
   
}
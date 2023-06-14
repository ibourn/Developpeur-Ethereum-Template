
/*! exemple non fonctionnel en l'état!*/
contract Alice {
   function ping(uint) public returns (uint){}
}

/*si ping revert à cause d'une erreur inattendue,
tout est reverté, x ne sera pas modifié*/
contract Bob   {
   uint x = 0;
   function pong(Alice c) public{
       x = 1;
       c.ping(42);
       x = 2;
   }
} 

/*call ne revert pas mais renvoie false si ping revert,
ici, si ping revert, pong coninue son execution et x sera modifié*/
contract Bob2   {
   uint x = 0;
   function pong(Alice c) public{
       x = 1;
       address(c).call("ping");
       x = 2;
   }
} 